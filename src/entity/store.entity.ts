import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Coupon } from "./coupon.entity";

@Entity()
export class Store {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column()
    description: string;

    @Column({ nullable: true })
    imageUrl: string;

    @ManyToOne(() => User, (user) => user.stores)
    owner: User;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => Coupon, (coupon) => coupon.store)
    coupons: Coupon[];
}