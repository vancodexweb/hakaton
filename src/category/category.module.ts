import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Category} from "./category.entity";
import {Product} from "../product/product.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Category, Product])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
