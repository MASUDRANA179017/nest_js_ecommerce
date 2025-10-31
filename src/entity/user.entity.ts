import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Store } from "./store.entity";
import { Order } from "./order.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ unique: true })
    email: string;
    @Column()
    password: string;
    @Column()
    firstName: string;
    @Column()
    lastName: string;
    @Column()
    username: string;
    @Column({ default: false })
    isActive: boolean;
    @Column()
    role: string;
    @Column({nullable: true})
    refreshToken?: string;

    @Column({nullable: true})
    profileImage?: string;

    @OneToMany(() => Store, (store) => store.owner)
    stores: Store[];

    @OneToMany(()=> Order, (order)=>order.items)
    OrderItem: Order[];
}
