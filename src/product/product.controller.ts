import {Body, Controller, Post} from '@nestjs/common';
import { ProductService } from './product.service';
import {Role} from "../auth/user.entity";
import {Roles} from "../auth/decorators/roles.decorator";
import {CreateProductDto} from "./dto/create-product.dto";

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Roles(Role.ADMIN)
  @Post()
  async create(@Body() dto: CreateProductDto) {
    return await this.productService.createProduct(dto)
  }
}
