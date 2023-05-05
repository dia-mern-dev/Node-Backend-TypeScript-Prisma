import * as yup from "yup";

import { ROLE } from "../types";
import { phoneRegExp } from "../constant";

export const registerSchema = yup.object({
  body: yup.object({
    email: yup.string().email().required(),
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    password: yup.string().required(),
    phone: yup.string().matches(phoneRegExp).required(),
    confirmPassword: yup.string().oneOf([yup.ref("password")], "Password not matched"),
    role: yup.mixed().oneOf(Object.values(ROLE)),
  }),
});

export const loginSchema = yup.object({
  body: yup.object({
    email: yup.string().email().required(),
    password: yup.string().required(),
    remember: yup.boolean(),
  }),
});
