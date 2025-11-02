import jwt from "jsonwebtoken";
import { appEnv } from "../config/env";
import { jwtObject } from "../types/interface";

const ACCESS_TOKEN_SECRET = appEnv.jwt.accessSecret;
const REFRESH_TOKEN_SECRET = appEnv.jwt.refreshSecret;
const FORGET_PASSWORD_SECRET = appEnv.jwt.forgetPassSecret;

export const generateAccessToken = (payload: jwtObject): string => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};

export const generateRefreshToken = (payload: jwtObject): string => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "30d" });
};

export const generateForgotPassToken = (email: string): string => {
  return jwt.sign(email, FORGET_PASSWORD_SECRET, { expiresIn: "5m" });
};
