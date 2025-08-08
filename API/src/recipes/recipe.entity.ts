import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../auth/user.entity';

export enum Unit {
  GRAM = 'g',
  KILOGRAM = 'kg',
  MILLILITER = 'ml',
  LITER = 'l',
  TEASPOON = 'tsp',
  TABLESPOON = 'tbsp',
  PIECE = 'pcs',
}

export interface Ingredient {
  name: string;
  amount: number;
  unit: Unit;
}

@Entity()
export class Recipe {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  image: string;

  @Column('text')
  content: string;

  @Column({ type: 'jsonb' })
  ingredients: Ingredient[];

  @Column()
  authorId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'authorId' })
  author: User;

  @CreateDateColumn()
  createdAt: Date;
}
