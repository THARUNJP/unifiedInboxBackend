import { z } from "zod";

export const createNoteSchema = z.object({
  contactId: z.string().min(1,"Cannot be empty"),
  content: z.string().min(1, "Content is required"),
  isPrivate: z.boolean().default(false),
}).strict();

export const updateNoteSchema = z.object({
  noteId:z.string().min(1,"Cannot be empty"),
  content: z.string().min(1, "Content is required"),
  isPrivate: z.boolean(),
}).strict();

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;