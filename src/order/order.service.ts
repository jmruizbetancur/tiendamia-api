import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { ProductService } from 'src/product/product.service';
import { CreateOrderDto, OrderProductDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Product } from 'src/product/entities/product.entity';
import { OrderProduct } from './entities/order-product.entity';
import { FindAllOrdersFilters } from './interfaces/find-all-orders-filters.interface';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(OrderProduct) private orderProductRepository: Repository<OrderProduct>,
    readonly productService: ProductService
  ) {}

  private async checkProductAvailability(orderProducts: OrderProductDto[]): Promise<Product[]> {
    const updatedProducts: Product[] = [];
    for await (const orderProduct of orderProducts) {
      const product = await this.productService.findOne(orderProduct.id)
        .catch(() => {
          throw new InternalServerErrorException(`Something failed trying to get product ${orderProduct.id}.`);
        });
      
      if (!product) {
        throw new BadRequestException(`The product ${orderProduct.id} does not exist.`);
      }

      if (orderProduct.quantity > product.quantity) {
        throw new BadRequestException(`Not enough quantity available for product ${orderProduct.id}.`);
      }

      product.quantity -= orderProduct.quantity;
      updatedProducts.push(product);
    }

    return updatedProducts;
  }

  async create(orderData: CreateOrderDto): Promise<Order> {
    const updatedProducts = await this.checkProductAvailability(orderData.products);

    const order = await this.orderRepository.save(
      this.orderRepository.create(orderData)
    ).catch(() => {
      throw new InternalServerErrorException(`Something failed creating the order.`);
    });
    
    await this.productService.updateProductsQuantity(updatedProducts)
      .catch(() => {
        throw new InternalServerErrorException(`Something failed trying to update the quantity of the products.`);
      });

    for await (const orderProduct of orderData.products) {
      await this.orderProductRepository.save(
        this.orderProductRepository.create({
          order: order,
          product: updatedProducts.find((product) => product.id === orderProduct.id),
          quantity: orderProduct.quantity
        })
      ).catch(() => {
        throw new InternalServerErrorException(`Something failed associating the product ${orderProduct.id} with the order.`);
      });
    }
    
    return order;
  }

  findAll(filters: FindAllOrdersFilters): Promise<Order[]> {
    const query = this.orderRepository.createQueryBuilder('order');

    if (filters.status) {
      query.andWhere('order.status = :status', { status: filters.status });
    }

    if (filters.fulfillPromise) {
      query.andWhere(`order.shippingPromise BETWEEN DATE('now')  AND DATE('now', '+:days days')`, { days: filters.fulfillPromise })
    }

    if (filters.dateRange && filters.dateRange.length) {
      query.andWhere(`order.createDate BETWEEN :dateA AND :dateB`, { dateA: filters.dateRange[0],  dateB: filters.dateRange[1] })
    }

    return query.getMany();
  }

  async findOne(id: number): Promise<Order> {
    return await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderProducts', 'orderProduct')
      .leftJoinAndSelect('orderProduct.product', 'product')
      .select([ 'order', 'orderProduct.quantity' ])
      .addSelect([ 'product.id', 'product.title', 'product.url', 'product.price' ])
      .where('order.id = :id', { id })
      .getOne();
  }
}
