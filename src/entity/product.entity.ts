import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "./user.entity";
import { Store } from "./store.entity";

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
}
