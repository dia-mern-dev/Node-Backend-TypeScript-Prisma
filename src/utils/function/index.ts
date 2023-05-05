import { IUser } from "../types";

export const filterUserWithoutPass = (user: IUser) => {
  const data: Partial<IUser> = { ...user };
  delete data.password;
  return data;
};

export const randomId = (length: number) => {
  let result = "";
  const characters = "0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
