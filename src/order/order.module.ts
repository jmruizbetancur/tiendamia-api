import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order } from './entities/order.entity';
import { ProductModule } from 'src/product/product.module';
import { OrderProduct } from './entities/order-product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ Order, OrderProduct ]),
    ProductModule
  ],
  controllers: [ OrderController ],
  providers: [ OrderService ],
})
export class OrderModule {}
