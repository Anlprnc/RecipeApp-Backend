import { Request, Response, NextFunction } from "express"
import { CreateFoodDto, UpdateFoodDto } from "../dtos/food.dto"
import { RecipeStep } from "../entities/recipe-step.entity"
import { AppDataSource } from "../config/database"
import { Food, RecipeType } from "../entities/food.entity"

export class FoodController {
    private foodRepository = AppDataSource.getRepository(Food)
    private stepRepository = AppDataSource.getRepository(RecipeStep)

    async getAllFoods(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const foods = await this.foodRepository.find({
                relations: ["steps"],
                order: {
                    title: "ASC"
                }
            });
            res.json(foods);
        } catch (error) {
            console.error('Error in getAllFoods:', error);
            next(error);
        }
    }

    async getFoodsByType(req: Request, res: Response): Promise<void> {
        try {
            const { type } = req.params
            const foods = await this.foodRepository.find({
                where: { type: type as RecipeType },
                relations: ["steps"],
                order: {
                    title: "ASC"
                }
            });
            res.json(foods);
        } catch (error) {
            console.error('Error in getFoodsByType:', error)
            res.status(500).json({ error: "Error fetching foods by type" })
        }
    }

    async getFood(req: Request, res: Response): Promise<void> {
        try {
            const food = await this.foodRepository.findOne({
                where: { id: req.params.id },
                relations: ["steps"]
            })
            
            if (!food) {
                res.status(404).json({ error: "Food not found" })
            }
            
            res.json(food)
        } catch (error) {
            console.error('Error in getFood:', error)
            res.status(500).json({ error: "Error fetching food" })
        }
    }

    async createFood(req: Request, res: Response): Promise<void> {
        try {
            const foodData: CreateFoodDto = req.body

            const food = this.foodRepository.create({
                imageName: foodData.imageName,
                title: foodData.title,
                description: foodData.description,
                ingredients: foodData.ingredients,
                time: foodData.time,
                type: foodData.type,
                steps: foodData.steps.map(step => this.stepRepository.create({
                    stepNumber: step.stepNumber,
                    description: step.description
                }))
            })

            await this.foodRepository.save(food)
            res.status(201).json(food)
        } catch (error) {
            console.error('Error in createFood:', error)
            res.status(500).json({ error: "Error creating food" })
        }
    }

    async updateFood(req: Request, res: Response): Promise<void> {
        try {
            const foodId = req.params.id
            const updateData: UpdateFoodDto = req.body

            const food = await this.foodRepository.findOne({
                where: { id: foodId },
                relations: ["steps"]
            })

            if (!food) {
                res.status(404).json({ error: "Food not found" })
                return;
            }

            if (updateData.imageName) food.imageName = updateData.imageName
            if (updateData.title) food.title = updateData.title
            if (updateData.description) food.description = updateData.description
            if (updateData.ingredients) food.ingredients = updateData.ingredients
            if (updateData.time) food.time = updateData.time
            if (updateData.type) food.type = updateData.type

            if (updateData.steps) {
                await this.stepRepository.remove(food.steps)
                
                food.steps = updateData.steps.map(step => 
                    this.stepRepository.create({
                        stepNumber: step.stepNumber,
                        description: step.description
                    })
                )
            }

            const updatedFood = await this.foodRepository.save(food)
            res.json(updatedFood)
        } catch (error) {
            console.error('Error in updateFood:', error)
            res.status(500).json({ error: "Error updating food" })
        }
    }

    async deleteFood(req: Request, res: Response): Promise<void> {
        try {
            const foodId = req.params.id
            const food = await this.foodRepository.findOne({
                where: { id: foodId },
                relations: ["steps"]
            })

            if (!food) {
                res.status(404).json({ error: "Food not found" })
                return;
            }

            await this.foodRepository.remove(food)
            res.status(204).send()
        } catch (error) {
            console.error('Error in deleteFood:', error)
            res.status(500).json({ error: "Error deleting food" })
        }
    }

    async searchFoods(req: Request, res: Response): Promise<void> {
        try {
            const { query } = req.query
            const foods = await this.foodRepository
                .createQueryBuilder("food")
                .leftJoinAndSelect("food.steps", "steps")
                .where("LOWER(food.title) LIKE LOWER(:query)", { query: `%${query}%` })
                .orWhere("LOWER(food.description) LIKE LOWER(:query)", { query: `%${query}%` })
                .orderBy("food.title", "ASC")
                .getMany()

            res.json(foods)
        } catch (error) {
            console.error('Error in searchFoods:', error)
            res.status(500).json({ error: "Error searching foods" })
        }
    }
}
