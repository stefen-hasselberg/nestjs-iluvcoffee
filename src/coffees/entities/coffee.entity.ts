import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Flavour } from './flaour.entity';

@Entity()
export class Coffee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  brand: string;

  @Column()
  recommendation: number;

  @JoinTable()
  @ManyToMany((type) => Flavour, (flavour) => flavour.coffees, {
    cascade: true,
  })
  flavours: Flavour[];
}
