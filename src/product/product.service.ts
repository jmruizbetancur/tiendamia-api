import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>
  ) {}

  create(createProductDto: CreateProductDto): Promise<Product> {
    return this.productRepository.save(
      this.productRepository.create(createProductDto)
    );
  }

  findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  findOne(id: number): Promise<Product> {
    return this.productRepository.findOneBy({ id });
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id)
      .catch(() => {
        throw new InternalServerErrorException(`Something failed trying to get product ${id}.`);
      });
    
    if (!product) {
      throw new BadRequestException(`The product ${id} does not exist.`);
    }

    return this.productRepository.save({ ...product, ...updateProductDto })
  }

  updateProductsQuantity(products: Product[]): Promise<Product[]> {
    return this.productRepository.save(products);
  }
}
