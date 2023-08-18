import { Controller, Get, Post, Body, Param, Query, ParseIntPipe, ParseArrayPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('fulfillPromise', new ParseIntPipe({ optional: true })) fulfillPromise?: number,
    @Query('dateRange', new ParseArrayPipe({ optional: true })) dateRange?: string[]
  ) {
    return this.orderService.findAll({
      status,
      fulfillPromise,
      dateRange
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }
}
