import { Router } from "express";
import { authMiddleware } from "../middelware/authMiddelware";
import { validators } from "../validators/index.validator";


const router = Router();

router.post("/create",authMiddleware,validators.createMessage)


export default router;