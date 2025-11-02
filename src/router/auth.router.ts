import { Router } from "express";
import { validators } from "../validators/index.validator";
import { getUser, login, register } from "../controller/auth.controller";
import { authMiddleware } from "../middelware/authMiddelware";

const router = Router();

router.post("/register", validators.register, register);
router.post("/login", validators.login, login);
router.get("/me",authMiddleware,getUser)

export default router;
