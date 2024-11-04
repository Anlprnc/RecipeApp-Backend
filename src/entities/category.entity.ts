import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Food } from "./food.entity";

@Entity("categories")
export class Category {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  title!: string;

  @OneToMany(() => Food, (food) => food.category, {
    cascade: true,
    eager: true,
  })
  items!: Food[];
}
