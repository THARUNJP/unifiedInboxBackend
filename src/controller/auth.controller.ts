import { NextFunction, Request, Response } from "express";
import * as AuthService from "../service/auth.service";

async function register(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const { email, password, name } = req.body;

    const user = await AuthService.register({ email, password, name });

    return res.status(201).json({
      // later try to return class based sucess response
      message: "User registered successfully",
      user,
    });
  } catch (err) {
    next(err);
  }
}

async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    // Call service layer
    const result = await AuthService.login({ email, password });

    // Send response
    res.status(200).json({
      status: true,
      message: "Login successful",
      data: result,
    });
  } catch (err) {
    next(err); // Forward error to centralized handler
  }
}

 async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id; // added by auth middleware after verifying token

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await AuthService.getUser(userId);

    return res.status(200).json({
      message: "User fetched successfully",
      data: user,
    });
  } catch (err) {
    next(err);
  }
}
export { register, login, getUser };
