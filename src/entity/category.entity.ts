import { Product } from "./product.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Category {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description?: string;

    @OneToMany(() => Product, (product) => product.category)
    product: Product[];

} 