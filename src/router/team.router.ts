import { Router } from "express";
import { addTeamMember, createTeam, deleteTeam, deleteTeamMember, getAllTeams, getTeamById, getTeamMembers, updateTeamMemberRole } from "../controller/team.controller";
import { authMiddleware } from "../middelware/authMiddelware";
import { validators } from "../validators/index.validator";


const router = Router();

router.post("/",authMiddleware,validators.team,createTeam)
router.get("/",authMiddleware,getAllTeams)
router.get("/:id",authMiddleware,getTeamById)
router.post("/:teamId/members",authMiddleware,validators.addTeamMember,addTeamMember)
router.put("/:teamId/members/:memberId",authMiddleware,validators.updateTeamMember,updateTeamMemberRole)
router.delete("/:teamId/members/:memberId",authMiddleware,deleteTeamMember)
router.get("/:teamId/members",authMiddleware,getTeamMembers)
router.delete("/:teamId",authMiddleware,deleteTeam)


export default router;
