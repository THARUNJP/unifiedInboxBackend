import { validateBody } from "../middelware/validator";
import { loginSchema, registerSchema } from "./auth.validator";



export const validators = {
  register: validateBody(registerSchema),
  login: validateBody(loginSchema),
};
