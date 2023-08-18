import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { dataSourceOptions } from './db/data-source';

@Module({
  imports: [ 
    TypeOrmModule.forRoot(dataSourceOptions),
    ProductModule, 
    OrderModule 
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
