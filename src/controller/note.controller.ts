import { NextFunction, Request, Response } from "express";
import * as NoteService from "../service/notes.service";

async function createNote(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { contactId, content, isPrivate } = req.body;

    // 3️ Call service
    const note = await NoteService.createNote({
      contactId,
      content,
      isPrivate,
      userId,
    });

    // 4️ Send success response
    return res.status(201).json({
      message: "Note created successfully",
      data: note,
    });
  } catch (error) {
    // Pass to global error handler
    next(error);
  }
}

async function getNotesByContactId(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const { contactId } = req.params;

    if (!contactId) {
      return res.status(400).json({ message: "contactId is required" });
    }

    const notes = await NoteService.getNotesByContact(contactId);

    return res.status(200).json({
      message: "Notes fetched successfully",
      data: notes,
    });
  } catch (err) {
    next(err); // delegate to global error handler
  }
}
async function getNotesById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: " NoteId is required" });
    }

    const note = await NoteService.getNotesById(id);

    return res.status(200).json({
      message: "Note fetched successfully",
      data: note,
    });
  } catch (error) {
    next(error);
  }
}
async function updateNote(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const userId = req.user?.id; // assuming auth middleware sets this
    const payload = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId not present" });
    }

    const updatedNote = await NoteService.updateNote({
      userId,
      payload,
    });

    return res.status(200).json({
      message: "Note updated successfully",
      data: updatedNote,
    });
  } catch (error) {
    next(error);
  }
}
async function deleteNote(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "NoteId is required" });
    }

    const result = await NoteService.deleteNote(id);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
export { createNote, getNotesByContactId, deleteNote, updateNote, getNotesById };
