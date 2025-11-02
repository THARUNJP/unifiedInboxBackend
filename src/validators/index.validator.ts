import { validateBody } from "../middelware/validator";
import { loginSchema, registerSchema } from "./auth.validator";
import { contactSchema } from "./contact.validator";



export const validators = {
  register: validateBody(registerSchema),
  login: validateBody(loginSchema),
  contact:validateBody(contactSchema)
};
