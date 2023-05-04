export enum ROLE {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
}

export interface IRegisterInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: ROLE;
}

export interface ILoginInfo {
  email: string;
  password: string;
  remember: string;
}

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: string;
}
