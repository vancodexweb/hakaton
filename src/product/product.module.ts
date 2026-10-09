import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Product} from "./product.entity";
import {Category} from "../category/category.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
