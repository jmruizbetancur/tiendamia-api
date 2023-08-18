import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OrderStatus } from '../constants/order-status.constants';
import { OrderProduct } from './order-product.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'create_date', type: 'date' })
  createDate: Date;

  @Column()
  status: string;

  @Column()
  client: string;

  @Column({ name: 'shipping_address' })
  shippingAddress: string;

  @Column({ name: 'shipping_promise', type: 'date' })
  shippingPromise: Date;

  @OneToMany(() => OrderProduct, orderProduct => orderProduct.order)
  orderProducts: OrderProduct[];
}
