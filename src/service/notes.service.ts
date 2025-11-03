import { prisma } from "../config/prisma";
import { NotFound } from "../lib/errors/httpError";
import { CreateNoteParams } from "../types/interface";
import { UpdateNoteInput } from "../validators/note.validator";

export const createNote = async ({
  contactId,
  content,
  isPrivate,
  userId,
}: CreateNoteParams) => {
  const contact = await prisma.contact.findFirst({
    where: {
      id: contactId,
      isActive: true,
    },
    select: {
      id: true,
      teamId: true,
    },
  });

  if (!contact) {
    throw new NotFound("Contact not found or inactive");
  }

  const newNote = await prisma.note.create({
    data: {
      contactId,
      content,
      isPrivate,
      userId,
      teamId: contact.teamId,
    },
  });

  return newNote;
};

export const getNotesByContact = async (contactId: string) => {
  // 1️ Validate the contact exists and is active
  const contact = await prisma.contact.findFirst({
    where: { id: contactId, isActive: true },
    select: { id: true },
  });

  if (!contact) {
    throw new NotFound("Contact not found");
  }

  // 2️ Fetch notes for that contact
  const notes = await prisma.note.findMany({
    where: {
      contactId,
      isPrivate: false,
      isActive: true,
    },
    orderBy: { createdAt: "desc" },
  });

  //  findMany() always returns an array (never null)
  if (notes.length === 0) {
    throw new NotFound("No notes available for this contact");
  }

  return notes;
};

export const getNotesById = async (noteId: string) => {
  const note = await prisma.note.findFirst({
    where: { id: noteId, isActive: true },
  });

  if (!note) {
    throw new NotFound("Note not found");
  }

  return note;
};

export const updateNote = async ({
  userId,
  payload,
}: {
  userId: string;
  payload: UpdateNoteInput;
}) => {
  const { noteId: id, isPrivate, content } = payload;

  // Check if the note exists and belongs to the user
  const note = await prisma.note.findFirst({
    where: { id, userId, isActive: true },
  });

  if (!note) throw new NotFound("Note not found");

  // Update the note
  const updatedNote = await prisma.note.update({
    where: { id },
    data: {
      isPrivate,
      content,
      updatedAt: new Date(), // need to create manual trigger later in db
    },
  });

  return updatedNote;
};

export const deleteNote = async (noteId: string) => {
  const existingNote = await prisma.note.findFirst({
    where: { id: noteId, isActive: true },
  });

  if (!existingNote) {
    throw new NotFound("Note not found");
  }

  await prisma.note.update({
    where: { id: noteId },
    data: { isActive: false, updatedAt: new Date() },
  });

  return { message: "Note deleted successfully" };
};
