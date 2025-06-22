import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "./user.entity";
import { Product } from "./product.entity";

@Entity()
export class Review {
    @PrimaryColumn()
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