import { NextFunction, Request, Response } from "express";
import * as ContactService from "../service/conatct.service";

async function createContact(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const userId = req.user?.id; // added by auth middleware after verifying token

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const contact = await ContactService.createContact(req.body, userId);

    return res.status(201).json({
      // later try to return class based sucess response
      status: true,
      message: "Contact created successfully",
      contact,
    });
  } catch (err) {
    next(err);
  }
}

async function getAllContacts(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    // 1Get logged-in user
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ status: false, message: "Unauthorized" });
    }

    // 2️ Fetch contacts with filters/pagination from query params
    const contacts = await ContactService.getContacts(userId, req.query);

    // 3️ Return standard API response
    return res.status(200).json({
      status: true,
      message: "Contacts fetched successfully",
      data: contacts,
    });
  } catch (err) {
    next(err);
  }
}

async function getContactById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id: contactId } = req.params;
    const contact = await ContactService.getContactById(userId, contactId);

    return res.status(200).json({
      status: true,
      message: "Contact fetched successfully",
      data: contact,
    });
  } catch (err) {
    next(err);
  }
}

async function updateContact(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { id: contactId } = req.params;

    const updated = await ContactService.updateContact(
      userId,
      contactId,
      req.body
    );

    return res.status(200).json({
      status: true,
      message: "Contact updated successfully",
      data: updated,
    });
  } catch (err) {
    next(err);
  }
}

async function deleteContact(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { id: contactId } = req.params;

    const result = await ContactService.deleteContact(userId, contactId);

    return res.status(200).json({
      status: true,
      message: result.message,
    });
  } catch (err) {
    next(err);
  }
}

export {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
};
