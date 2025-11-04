import { z } from "zod";

export const createMessageSchema = z.object({
  contactId: z.uuid().min(1,"contact is required"),
  teamId: z.uuid().min(1,"teamId is required"),
  channelId: z.uuid().min(1, "Channel is required"),
  content: z.string().min(1, "Message content is required"),
  direction: z.enum(["INBOUND", "OUTBOUND"]),
});

export type CreateMessageInput = z.infer<typeof createMessageSchema>