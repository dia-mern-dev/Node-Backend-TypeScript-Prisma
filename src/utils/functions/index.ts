import { IUser } from "../types";

export const filterUserWithoutPass = (user: IUser) => {
  const data: Partial<IUser> = { ...user };
  delete data.password;
  return data;
};
