import { Router } from "express"
import { FoodController } from "../controllers/food.controller"

const router = Router()
const foodController = new FoodController()

router.get("/", foodController.getAllFoods.bind(foodController))
router.get("/search", foodController.searchFoods.bind(foodController))
router.get("/type/:type", foodController.getFoodsByType.bind(foodController))
router.get("/:id", foodController.getFood.bind(foodController))
router.post("/", foodController.createFood.bind(foodController))
router.put("/:id", foodController.updateFood.bind(foodController))
router.delete("/:id", foodController.deleteFood.bind(foodController))

export default router