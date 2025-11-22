export interface ILoginCredentials {
  email: string;
  password: string;
}

export interface IRegisterCredentials {
  name: string;
  email: string;
  password: string;
  role: "patient" | "doctor" | "finance";
  specialization?: string;
  phone?: string;
}

export interface IChangePassword {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IAuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: "patient" | "doctor" | "finance";
    specialization?: string;
    phone?: string;
  };
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: "patient" | "doctor" | "finance";
  specialization?: string;
  phone?: string;
  _id: string;
}
export interface IDoctor {
  id: string;
  _id: string;
  email: string;
  name: string;
  specialization: string;
}
