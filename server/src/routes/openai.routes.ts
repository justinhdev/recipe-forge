import { Router } from "express";
import { generateRecipe } from "../controllers/openai.controller";
import { protect } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { generateRecipeBodySchema } from "../schemas/openai.schema";

const router = Router();

router.post(
  "/generate",
  protect,
  validate({ body: generateRecipeBodySchema }),
  generateRecipe
);

export default router;
