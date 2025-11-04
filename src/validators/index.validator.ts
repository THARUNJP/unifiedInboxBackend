import { validateBody } from "../middelware/validator";
import { loginSchema, registerSchema } from "./auth.validator";
import { contactSchema } from "./contact.validator";
import { createMessageSchema } from "./message.validator";
import { createNoteSchema, updateNoteSchema } from "./note.validator";
import {
  addTeamMemberSchema,
  createTeamSchema,
  updateTeamMemberSchema,
} from "./team.validator";

export const validators = {
  register: validateBody(registerSchema),
  login: validateBody(loginSchema),
  contact: validateBody(contactSchema),
  team: validateBody(createTeamSchema),
  addTeamMember: validateBody(addTeamMemberSchema),
  updateTeamMember: validateBody(updateTeamMemberSchema),
  createNote: validateBody(createNoteSchema),
  updateNote: validateBody(updateNoteSchema),
  createMessage:validateBody(createMessageSchema)
};
