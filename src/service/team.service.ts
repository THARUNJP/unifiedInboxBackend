import { prisma } from "../config/prisma";
import { BadRequest, Forbidden, NotFound } from "../lib/errors/httpError";
import { AssignableRole } from "../types/interface";

export const createTeam = async (teamName: string, userId: string) => {
  const result = await prisma.$transaction(async (tx) => {
    const team = await tx.team.create({
      data: {
        name: teamName,
      },
    });

    const teamMember = await tx.teamMember.create({
      data: {
        userId,
        teamId: team.id,
        role: "ADMIN",
      },
    });

    return { team, teamMember };
  });

  return result;
};

export const getAllTeams = async (userId: string) => {
  const teams = await prisma.teamMember.findMany({
    where: { userId },
    select: {
      role: true,
      team: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
  const formattedTeams = teams.map((tm) => ({
    id: tm.team.id,
    name: tm.team.name,
    role: tm.role,
  }));

  return formattedTeams;
};

export const getTeamById = async (teamId: string) => {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: {
      createdBy: {
        select: { id: true, name: true, email: true },
      },
      members: {
        include: {
          user: { select: { id: true, name: true, email: true, role: true } },
        },
      },
      _count: {
        select: {
          contacts: true,
          conversations: true,
        },
      },
    },
  });

  return team;
};

export const addTeamMember = async (
  teamId: string,
  adminId: string,
  joineeId: string,
  role: AssignableRole
) => {
  // Check if admin belongs to the team
  const adminMembership = await prisma.teamMember.findFirst({
    where: { userId: adminId, teamId },
  });

  if (!adminMembership) throw new NotFound("Team not found");

  // Verify admin privileges
  if (adminMembership.role !== "ADMIN") {
    throw new Forbidden("Access denied — only admins can add members");
  }

  // Prevent duplicate member addition
  const existingMember = await prisma.teamMember.findFirst({
    where: { userId: joineeId, teamId },
  });

  if (existingMember) {
    throw new BadRequest("User is already a member of this team");
  }

  // Create team membership
  const newMember = await prisma.teamMember.create({
    data: {
      userId: joineeId,
      teamId,
      role,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return newMember;
};

export const updateTeamMemberRole = async (
  teamId: string,
  adminId: string,
  memberId: string,
  newRole: AssignableRole
) => {
  // Validate that adminId is an admin of this team
  const adminRecord = await prisma.teamMember.findFirst({
    where: { teamId, userId: adminId },
  });

  if (!adminRecord) throw new NotFound("Team not found or access denied");
  if (adminRecord.role !== "ADMIN")
    throw new Forbidden("Only admin can update member roles");

  // Check if target member exists
  const memberRecord = await prisma.teamMember.findFirst({
    where: { teamId, userId: memberId },
  });

  if (!memberRecord) throw new NotFound("Member not found in this team");

  // Update the role
  const updated = await prisma.teamMember.update({
    where: { id: memberRecord.id },
    data: { role: newRole },
    include: { user: { select: { id: true, name: true, email: true } } },
  });

  return updated;
};
