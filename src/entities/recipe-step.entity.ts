import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { Food } from "./food.entity"

@Entity('recipe_steps')
export class RecipeStep {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column()
    stepNumber!: number

    @Column('text')
    description!: string

    @ManyToOne(() => Food, food => food.steps, {
        onDelete: 'CASCADE'
    })
    food!: Food
}