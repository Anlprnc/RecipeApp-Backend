import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { RecipeStep } from "./recipe-step.entity"

export enum RecipeType {
    SOUP = "Soup",
    SALAD = "Salad",
    PUREES = "Purees",
    MAIN_DISHES = "Main Dishes",
    SNACK = "Snack",
    BREAKFAST = "Breakfast",
    LUNCH = "Lunch",
    DINNER = "Dinner",
    DESSERT = "Dessert"
}

@Entity('foods')
export class Food {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column({
        name: 'image_name',
        type: 'varchar'
    })
    imageName!: string

    @Column({
        type: 'varchar',
        length: 255
    })
    title!: string

    @Column({
        type: 'text'
    })
    description!: string

    @Column({
        type: 'simple-array'
    })
    ingredients!: string[]

    @Column({
        type: 'varchar'
    })
    time!: string

    @Column({
        type: 'enum',
        enum: RecipeType,
        default: RecipeType.MAIN_DISHES
    })
    type!: RecipeType

    @OneToMany(() => RecipeStep, step => step.food, {
        cascade: true,
        eager: true
    })
    steps!: RecipeStep[]
}