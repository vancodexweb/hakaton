import {Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Post} from '@nestjs/common';
import { CategoryService } from './category.service';
import {Roles} from "../auth/decorators/roles.decorator";
import {Role} from "../auth/user.entity";
import {CreateCategoryDto} from "./dto/create-category.dto";
import {Public} from "../auth/decorators/public.decorator";

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Roles(Role.ADMIN)
  @Post('create')
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoryService.createCategory(createCategoryDto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.categoryService.delete(id);
  }

  @Public()
  @Get('all')
  async getAllCategories() {
    return await this.categoryService.getAll()
  }

  @Public()
  @Get(':id')
  async getOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.categoryService.getOne(id);
  }
}
