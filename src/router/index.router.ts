import { Router } from "express";
import authRouter from "./auth.router"
import contactRouter from "./contact.router"
const router = Router();



router.use("/auth",authRouter)
router.use("/contact",contactRouter)







export default router