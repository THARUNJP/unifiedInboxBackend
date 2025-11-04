import { prisma } from "../config/prisma";
import { Forbidden, NotFound } from "../lib/errors/httpError";
import { CreateMessageInput } from "../validators/message.validator";


export const createMessage = async ({
  payload,
  userId,
}: {
  payload: CreateMessageInput;
  userId: string;
}) => {
  const { teamId, contactId, channelId, content, direction } = payload;

  // Validate team membership and permission
  const member = await prisma.teamMember.findFirst({
    where: { teamId, userId },
  });

  if (!member) throw new NotFound("You are not a member of this team");
  if (member.role === "VIEWER")
    throw new Forbidden("You dont have permission to send messages");

  // Find existing conversation (contact + channel + team)
  let conversation = await prisma.conversation.findFirst({
    where: { contactId, teamId, channelId },
  });

  // If not found, create a new conversation
  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        teamId,
        contactId,
        channelId,
        subject: `Conversation with Contact ${contactId}`,
        lastMessageAt: new Date(),
      },
    });
  }

  // Create a new message linked to that conversation
  const message = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      contactId,
      channelId,
      direction,
      type: "TEXT",
      content,
      status: "SENT",
      sentAt: new Date(),
    },
    select: {
      id: true,
      contactId: true,
      channelId: true,
      conversationId: true,
      content: true,
      direction: true,
      status: true,
      createdAt: true,
    },
  });

  // Update conversation’s lastMessageAt timestamp
  await prisma.conversation.update({
    where: { id: conversation.id },
    data: { lastMessageAt: new Date() },
  });

  // Return formatted response
  return {
    message: "Message created successfully",
    data: message,
  };
};

export const getMessages = async()=>{

}