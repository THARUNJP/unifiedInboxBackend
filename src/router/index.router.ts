import { Router } from "express";
import authRouter from "./auth.router"
import contactRouter from "./contact.router"
import teamRouter from "./team.router"
import noteRouter from "./note.router"
const router = Router();



router.use("/auth",authRouter)
router.use("/contact",contactRouter)
router.use("/teams",teamRouter)
router.use("/notes",noteRouter)






export default router