import { Router } from "express";
import { generateRecipe } from "../controllers/openai.controller";
import { validate } from "../middleware/validate.middleware";
import { aiRateLimit } from "../middleware/rateLimit.middleware";
import { generateRecipeBodySchema } from "../schemas/openai.schema";

const router = Router();

router.post(
  "/generate",
  aiRateLimit,
  validate({ body: generateRecipeBodySchema }),
  generateRecipe
);

export default router;
