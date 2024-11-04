import { Router } from "express"
import { FoodController } from "../controllers/food.controller"

const router = Router()
const foodController = new FoodController()

router.get("/foods", foodController.getAllFoods.bind(foodController))
router.get("/foods/search", foodController.searchFoods.bind(foodController))
router.get("/foods/type/:type", foodController.getFoodsByType.bind(foodController))
router.get("/foods/:id", foodController.getFood.bind(foodController))
router.post("/foods", foodController.createFood.bind(foodController))
router.put("/foods/:id", foodController.updateFood.bind(foodController))
router.delete("/foods/:id", foodController.deleteFood.bind(foodController))

export default router