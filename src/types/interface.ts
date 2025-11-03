import { Role } from "@prisma/client";

export interface jwtObject {
  id: string;
  email: string;
}

export type AssignableRole = Exclude<Role, "ADMIN">;

export interface CreateNoteParams {
  contactId: string;
  content: string;
  isPrivate: boolean;
  userId: string;
}