import { Router } from "express";
import { createContact, deleteContact, getAllContacts, getContactById, updateContact } from "../controller/contact.controller";
import { authMiddleware } from "../middelware/authMiddelware";
import { validators } from "../validators/index.validator";

const router = Router();

router.post("/",authMiddleware,validators.contact,createContact)
router.get("/",authMiddleware,getAllContacts)
router.get("/:id",authMiddleware,getContactById)
router.put("/:id", authMiddleware, updateContact);
router.delete("/:id", authMiddleware, deleteContact);


export default router;
