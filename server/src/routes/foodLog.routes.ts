import { Router } from "express";
import {
  createFoodLog,
  deleteFoodLog,
  getFoodLogs,
} from "../controllers/foodLog.controller";
import { protect } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  foodLogBodySchema,
  foodLogDateQuerySchema,
  foodLogIdParamsSchema,
} from "../schemas/foodLog.schema";

const router = Router();

router.get("/", protect, validate({ query: foodLogDateQuerySchema }), getFoodLogs);
router.post("/", protect, validate({ body: foodLogBodySchema }), createFoodLog);
router.delete(
  "/:id",
  protect,
  validate({ params: foodLogIdParamsSchema }),
  deleteFoodLog
);

export default router;
