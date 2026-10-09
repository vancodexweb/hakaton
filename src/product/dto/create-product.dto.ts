import { IsInt, IsNumber, IsOptional, IsPositive, IsString, IsUUID, Min, MinLength } from 'class-validator';

export class CreateProductDto {
    @IsString()
    @MinLength(2)
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    price: number;

    @IsInt()
    @Min(0)
    stock: number;

    @IsUUID()
    categoryId: string;
}