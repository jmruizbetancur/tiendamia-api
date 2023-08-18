import { ArrayNotEmpty, IsDate, IsEnum, IsInt, IsNotEmpty, IsPositive, IsString, Min, ValidateNested } from "class-validator";
import { OrderStatus } from "../constants/order-status.constants";

export class OrderProductDto {
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  id: number;

  @IsInt()
  @IsPositive()
  @Min(1)
  @IsNotEmpty()
  quantity: number;
}

export class CreateOrderDto {
  @IsString()
  @IsEnum(OrderStatus)
  @IsNotEmpty()
  status: OrderStatus;

  @IsString()
  @IsNotEmpty()
  client: string;

  @IsNotEmpty()
  shippingAddress: string;

  @IsDate()
  @IsNotEmpty()
  shippingPromise: Date;

  @ValidateNested()
  @ArrayNotEmpty()
  products: OrderProductDto[]
}
