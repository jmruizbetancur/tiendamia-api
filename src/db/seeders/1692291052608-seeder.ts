import { MigrationInterface, QueryRunner } from "typeorm";
import { Product } from "src/product/entities/product.entity";
import { Order } from "src/order/entities/order.entity";
import { OrderProduct } from "src/order/entities/order-product.entity";
import * as products from 'src/mocks/products.mock.json';
import * as orders from 'src/mocks/orders.mock.json';


export class Seeder1692291052608 implements MigrationInterface {
  name = 'Seeder1692291052608'

  public async up(queryRunner: QueryRunner): Promise<void> {
    const savedProducts = await queryRunner.manager.save(
      products.map((product) => queryRunner.manager.create(Product, product))
    ) as Product[];
    
    for await (const order of orders) {
      const savedOrder = await queryRunner.manager.save(
        queryRunner.manager.create(Order, order)
      ) as Order;   
      await queryRunner.manager.save(
        order.products.map((orderProduct) => queryRunner.manager.create(OrderProduct, {
          order: savedOrder,
          product: savedProducts.find((item) => item.id === orderProduct.id),
          quantity: orderProduct.quantity
        }))
      );
    }
    
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}

}
