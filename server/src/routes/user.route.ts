import { Router } from "express";
import { register, login, logout, me, refreshToken } from "../controllers/user.controller";
import { protect } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { RegisterSchema, LoginSchema } from "../dtos/user.dto";

const router = Router();

router.post("/register", validate(RegisterSchema), register);
router.post("/login", validate(LoginSchema), login);
router.post("/logout", protect, logout);
router.get("/me", protect, me);
router.get("/refresh", refreshToken);

export default router;