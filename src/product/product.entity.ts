import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Category} from "../category/category.entity";

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
        transformer: { to: (v: number) => v, from: (v: string) => parseFloat(v) },
    })
    price: number;

    @Column()
    description: string;

    @ManyToOne(() => Category, (c) => c.products)
    category: Category
}

