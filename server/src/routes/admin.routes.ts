import { Router } from "express";
import { getAdminStats } from "../controllers/admin.controller";
import { protect } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/admin.middleware";

const router = Router();

router.get("/stats", protect, requireAdmin, getAdminStats);

export default router;
