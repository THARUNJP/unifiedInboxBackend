import { NextFunction, Request, Response } from "express";
import * as TeamService from "../service/team.service";

async function createTeam(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const { teamName } = req.body;

    const data = TeamService.createTeam(teamName, userId);
    // Send response
    res.status(200).json({
      status: true,
      message: "Team created successful",
      data,
    });
  } catch (err) {
    next(err); // Forward error to centralized handler
  }
}

async function getAllTeams(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const userId = req.user?.id; // assume auth middleware sets req.user
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const teams = await TeamService.getAllTeams(userId);

    return res.status(200).json({
      message: "Teams fetched successfully",
      teams,
    });
  } catch (err) {
    next(err);
  }
}

async function getTeamById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const userId = req.user?.id; //
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { teamId } = req.params;
    if (!teamId)
      return res.status(400).json({ message: "Team ID is required" });

    const team = await TeamService.getTeamById(teamId);

    if (!team) return res.status(404).json({ message: "Team not found" });

    return res.status(200).json({
      message: "Team fetched successfully",
      team,
    });
  } catch (err) {
    next(err);
  }
}

async function addTeamMember(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const userId = req.user?.id;
    if (!userId)
      return res.status(401).json({ status: false, message: "Unauthorized" });

    const { teamId } = req.params;
    if (!teamId || typeof teamId !== "string")
      return res.status(400).json({ status: false, message: "Invalid teamId" });
    const { memberId, role } = req.body;

    // Call service
    const result = await TeamService.addTeamMember(
      teamId,
      userId,
      memberId,
      role
    );

    return res.status(201).json({
      status: true,
      message: "Member added successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

async function updateTeamMemberRole(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const userId = req.user?.id;
    if (!userId)
      return res.status(401).json({ status: false, message: "Unauthorized" });

    const { teamId, memberId } = req.params;
      if (!teamId || typeof teamId !== "string")
      return res.status(400).json({ status: false, message: "Invalid teamId" });

    if (!memberId || typeof memberId !== "string")
      return res
        .status(400)
        .json({ status: false, message: "Invalid memberId" });

    const { role } = req.body;

    // Prevent self role change
    if (userId === memberId) {
      return res.status(400).json({
        status: false,
        message: "You cannot modify your own role.",
      });
    }

    const updatedMember = await TeamService.updateTeamMemberRole(
      teamId,
      userId, // adminId
      memberId,
      role
    );

    return res.status(200).json({
      status: true,
      message: "Team member role updated successfully",
      data: updatedMember,
    });
  } catch (err) {
    next(err);
  }
}

export {
  createTeam,
  getAllTeams,
  getTeamById,
  addTeamMember,
  updateTeamMemberRole,
};
