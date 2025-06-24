import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
import { User } from "./user.entity";
import { Store } from "./store.entity";
import { Review } from "./review.entity";
import { Category } from "./category.entity";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column()
    description: string;

    @Column()
    price: number;

    @Column()
    stock: number;

    @ManyToOne(() => User, (user) => user.id)
    vendor: User;
    
    @ManyToOne(()=> Store, (store) => store.id)
    store: Store;

    @OneToMany(()=> Review, (review) => review.product)
    reviews: Review[];

    @ManyToOne(() => Category, (category) => category.product)
    category: Category;
}
