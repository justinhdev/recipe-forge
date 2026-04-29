import { Router } from "express";
import { generateRecipe } from "../controllers/openai.controller";
import { validate } from "../middleware/validate.middleware";
import { generateRecipeBodySchema } from "../schemas/openai.schema";

const router = Router();

router.post(
  "/generate",
  validate({ body: generateRecipeBodySchema }),
  generateRecipe
);

export default router;
