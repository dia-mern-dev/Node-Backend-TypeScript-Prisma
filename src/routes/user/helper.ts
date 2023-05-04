import * as yup from "yup";

import { ROLE } from "../../utils/types";
import { phoneRegExp } from "../../utils/constants";

export const registerSchema = yup.object({
  body: yup.object({
    email: yup.string().email().required(),
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    password: yup.string().required(),
    phone: yup.string().matches(phoneRegExp).required(),
    confirmPassword: yup.string().oneOf([yup.ref("password")], "Password not matched"),
    role: yup.mixed().oneOf(Object.values(ROLE)),
    skill: yup.array().min(1).of(yup.string()),
  }),
});
