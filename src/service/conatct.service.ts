import { prisma } from "../config/prisma";
import { Forbidden, NotFound } from "../lib/errors/httpError";
import { contactInput } from "../validators/contact.validator";



export const createContact = async (contact: contactInput, userId: string) => {
  const { teamId, ...contactData } = contact;

  //  Step 1: If teamId is provided, verify user is part of that team
  if (teamId) {
    const teamMember = await prisma.teamMember.findFirst({
      where: {
        teamId,
        userId,
      },
    });

    if (!teamMember) {
      throw new Forbidden("You can add members only if you are part of the team");
      // or simply: throw new Error("User is not part of this team");
    }
  }

  //  Step 2: Create contact
  const newContact = await prisma.contact.create({
    data: {
      ...contactData,
      teamId: teamId || "", // optional team association
    },
  });

  return newContact;
};

export const getContacts = async (userId: string, query: any) => {
  const { page = 1, limit = 10, search, isActive } = query;

  // 1️ Find user's teamIds
  const userTeams = await prisma.teamMember.findMany({
    where: { userId },
    select: { teamId: true },
  });
  const teamIds = userTeams.map(t => t.teamId);

  // 2️ Build dynamic filter
  const where: any = {
    teamId: { in: teamIds },
  };

  if (typeof isActive !== "undefined") {
    where.isActive = isActive === "true";
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
    ];
  }

  // 3️ Pagination
  const skip = (page - 1) * limit;
  const [contacts, total] = await Promise.all([
    prisma.contact.findMany({ where, skip, take: Number(limit), orderBy: { createdAt: "desc" } }),
    prisma.contact.count({ where }),
  ]);

  return { page, limit, total, contacts };
};

export const getContactById = async (userId: string, contactId: string) => {
  // Step 1: Get all team IDs the user is part of
  const teamMemberships = await prisma.teamMember.findMany({
    where: { userId },
    select: { teamId: true },
  });

  const teamIds = teamMemberships.map((t) => t.teamId);

  // Step 2: Check if user belongs to any team
  if (teamIds.length === 0) {
    throw new Forbidden("You are not part of any team");
  }

  // Step 3: Find the contact only if it belongs to one of the user’s teams
  const contact = await prisma.contact.findFirst({
    where: {
      id: contactId,
      teamId: { in: teamIds },
    },
    include: {
      notes: true,
      messages: true,
      conversations: true,
    },
  });

  // Step 4: Handle missing contact
  if (!contact) {
    throw new NotFound("Contact not found");
  }

  // Step 5: Return
  return contact;
};

export const updateContact = async (
  userId: string,
  contactId: string,
  data: contactInput
) => {
  // Step 1: Get all team IDs the user is part of
  const userTeams = await prisma.teamMember.findMany({
    where: { userId },
    select: { teamId: true },
  });

  const teamIds = userTeams.map(t => t.teamId);
  if (teamIds.length === 0) throw new Forbidden("You are not part of any team");

  // Step 2: Verify contact exists within user’s team
  const contact = await prisma.contact.findFirst({
    where: {
      id: contactId,
      teamId: { in: teamIds },
    },
  });

  if (!contact) throw new NotFound("Contact not found or access denied");

  // Step 3: Update the contact
  const updatedContact = await prisma.contact.update({
    where: { id: contactId },
    data,
  });

  return updatedContact;
};

export const deleteContact = async (userId: string, contactId: string) => {
  // Step 1: Get all team IDs of the user
  const userTeams = await prisma.teamMember.findMany({
    where: { userId },
    select: { teamId: true },
  });

  const teamIds = userTeams.map(t => t.teamId);
  if (teamIds.length === 0) throw new Forbidden("You are not part of any team");

  // Step 2: Check contact belongs to those teams
  const contact = await prisma.contact.findFirst({
    where: { id: contactId, teamId: { in: teamIds } },
  });

  if (!contact) throw new NotFound("Contact not found or access denied");

  // Step 3: Soft delete (mark inactive)
  await prisma.contact.update({
    where: { id: contactId },
    data: { isActive: !contact.isActive },
  });

  return { message: "Contact archived successfully" };
};