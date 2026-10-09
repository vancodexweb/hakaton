import {ConflictException, HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Category} from "./category.entity";
import {Repository} from "typeorm";
import {CreateCategoryDto} from "./dto/create-category.dto";
import {Product} from "../product/product.entity";

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) {}

    async getAll() {
        return {
            success: true,
            categories: await this.categoryRepository.find()
        }
    }

    async getOne(id: string) {
        const category = await this.categoryRepository.findOneBy({ id });
        if (!category) throw new NotFoundException('Category not found');
        return {
            success: true,
            category: category
        };
    }

    async createCategory(dto: CreateCategoryDto) {
        const exists = await this.categoryRepository.existsBy({ name: dto.name });
        if (exists) {
            throw new HttpException("Category already exists", HttpStatus.CONFLICT);
        }
        const newCategory = await this.categoryRepository.create({
            name: dto.name,
            description: dto.description,
        });
        await this.categoryRepository.save(newCategory);

        return {
            success: true,
            category: newCategory,
        }
    }

    async delete(id: string) {
        const category = await this.categoryRepository.findOneBy({ id });
        if (!category) throw new NotFoundException('Category not found');

        const hasProducts = await this.productRepository.existsBy({ category: { id } });
        if (hasProducts) throw new ConflictException('Category has products');

        await this.categoryRepository.delete({ id });

        return {
            success: true,
        }
    }
}
