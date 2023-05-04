export interface IRegisterInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: ROLE;
}

enum ROLE {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
}
