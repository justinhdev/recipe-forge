import { Router } from "express";
import {
  getUserRecipes,
  deleteRecipe,
  createRecipe,
} from "../controllers/recipe.controller";
import { protect } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  recipeBodySchema,
  recipeIdParamsSchema,
} from "../schemas/recipe.schema";

const router = Router();

router.get("/", protect, getUserRecipes);
router.post("/", protect, validate({ body: recipeBodySchema }), createRecipe);
router.delete(
  "/:id",
  protect,
  validate({ params: recipeIdParamsSchema }),
  deleteRecipe
);

export default router;
