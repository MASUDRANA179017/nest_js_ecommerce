import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from './product.entity';
import { Blog } from './blog.entity';


@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'enum', enum: ['post', 'product'] })
  type: 'post' | 'product';

  @Column({ type: 'text', nullable: true })
  description?: string;

  @OneToMany(() => Blog, (blog) => blog.tags, { cascade: true })
  blogs: Blog[];

  @OneToMany(() => Product, (product) => product.tags, { cascade: true })
  products: Product[];
}
