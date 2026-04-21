import { Router } from "express";
import { registerUser, loginUser } from "../controllers/auth.controller";
import { validate } from "../middleware/validate.middleware";
import {
  loginUserBodySchema,
  registerUserBodySchema,
} from "../schemas/auth.schema";

const router = Router();

router.post(
  "/register",
  validate({ body: registerUserBodySchema }),
  registerUser
);
router.post("/login", validate({ body: loginUserBodySchema }), loginUser);

export default router;
