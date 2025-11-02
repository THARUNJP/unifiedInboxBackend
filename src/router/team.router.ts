import { Router } from "express";
import { addTeamMember, createTeam, getAllTeams } from "../controller/team.controller";
import { authMiddleware } from "../middelware/authMiddelware";
import { validators } from "../validators/index.validator";


const router = Router();

router.post("/",authMiddleware,validators.team,createTeam)
router.get("/",authMiddleware,getAllTeams)
router.get("/:id",authMiddleware)
router.post("/:teamId/members",authMiddleware,validators.addTeamMember,addTeamMember)


export default router;
