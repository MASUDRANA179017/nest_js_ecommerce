import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Product } from "./product.entity";

@Entity()
export class Review {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    rating: number;
    @Column()
    comment: string;
    @ManyToOne(()=> User, (user) => user.id)
    user: User;
    @ManyToOne(()=> Product, (product) => product.reviews)
    product: Product;
    @CreateDateColumn()
    createdAt: Date;

}