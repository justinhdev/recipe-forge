import { Router } from "express";
import {
  getDailyTarget,
  updateDailyTarget,
} from "../controllers/target.controller";
import { protect } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { targetBodySchema } from "../schemas/target.schema";

const router = Router();

router.get("/", protect, getDailyTarget);
router.put("/", protect, validate({ body: targetBodySchema }), updateDailyTarget);

export default router;
