import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Product} from "./product.entity";
import {Repository} from "typeorm";
import {Category} from "../category/category.entity";
import {CreateProductDto} from "./dto/create-product.dto";

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) {}

    async createProduct(dto: CreateProductDto) {
        const category = await this.categoryRepository.findOneBy({ id: dto.categoryId });
        if (!category) throw new NotFoundException('Category not found');

        const { categoryId, ...data } = dto;
        const product = this.productRepository.create({ ...data, category });
        return {
            success: true,
            product: await this.productRepository.save(product)
        }
    }
}
