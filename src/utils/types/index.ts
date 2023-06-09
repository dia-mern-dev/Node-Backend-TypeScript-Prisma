export enum ROLE {
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
  avatar: string | null;
  photo: string | null;
  created_at?: Date;
  updated_at?: Date;
}
