import { Router } from "express";
import { authMiddleware } from "../middelware/authMiddelware";
import { createNote, deleteNote, getNotesByContactId, getNotesById, updateNote } from "../controller/note.controller";
import { validators } from "../validators/index.validator";

const router = Router();


router.post("/",authMiddleware,validators.createNote,createNote)
router.get("/",authMiddleware,getNotesByContactId) // get all Notes for a contact
router.get("/:id",authMiddleware,getNotesById) // get a specific note
router.put("/:id",authMiddleware,validators.updateNote,updateNote) // update a specific note
router.delete("/:id",authMiddleware,deleteNote) // delete a specific note







export default router;
