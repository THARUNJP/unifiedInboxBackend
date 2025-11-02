import { prisma } from "../config/prisma";
import { Conflict, NotFound, Unauthorized } from "../lib/errors/httpError";
import { hashPassword, verifyPassword } from "../lib/helper";
import { jwtObject } from "../types/interface";
import { LoginInput, RegisterInput } from "../validators/auth.validator";
import { generateAccessToken, generateRefreshToken } from "./token.service";

export const register = async ({ email, password, name }: RegisterInput) => {
  // Check existing user
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Conflict("User already exists");
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Create new user
  const newUser = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
      role: "VIEWER",
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });

  return newUser;
};

export const login = async ({ email, password }: LoginInput) => {
  // 1️ Check if user exists
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) throw new NotFound("User not found");

  // 2️ Verify password
  if(user.id && user.passwordHash){
  const isValid = await verifyPassword(password, user?.passwordHash);
  if (!isValid) throw new Unauthorized("Invalid Password");
  }
const jwtPayload:jwtObject = { email: user.email, id: user.id };
  const access_token = generateAccessToken(jwtPayload);
  const refresh_token = generateRefreshToken(jwtPayload);


  // 4️ Return safe user data + token
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
    },
    token:{
      access_token,
      refresh_token
    }
  };
};

export const getUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role:true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new NotFound("User not found");
  }

  return user;
};