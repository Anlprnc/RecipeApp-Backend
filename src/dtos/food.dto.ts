import { RecipeType } from "../entities/food.entity"

export interface CreateFoodDto {
  imageName: string
  title: string
  description: string
  ingredients: string[]
  time: string
  type: RecipeType
  steps: {
      stepNumber: number
      description: string
  }[]
}

export interface UpdateFoodDto {
  imageName?: string
  title?: string
  description?: string
  ingredients?: string[]
  time?: string
  type?: RecipeType
  steps?: {
      stepNumber: number
      description: string
  }[]
}