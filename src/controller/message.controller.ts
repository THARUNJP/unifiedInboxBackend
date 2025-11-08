import { NextFunction, Request, Response } from "express";
import * as MessageService from "../service/message.service";

 async function createMessage(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { teamId, contactId, channelId, content, direction } = req.body;
    const payload = { teamId, contactId, channelId, content, direction };

    const result = await MessageService.createMessage({ payload, userId });

    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}


async function getMessage(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {

  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { teamId, contactId, channelId, content, direction } = req.body;
    const payload = { teamId, contactId, channelId, content, direction };

    const result = await MessageService.getMessages();

    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}


export { createMessage,getMessage}