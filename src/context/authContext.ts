import { createContext } from "react";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
}

export interface AuthContextType {
  token: string | null;
  user: AuthUser | null;
  customerToken: string | null;
  customerUser: AuthUser | null;
  adminToken: string | null;
  adminUser: AuthUser | null;
  login: (token: string, user: AuthUser) => void;
  logout: (role?: AuthUser["role"]) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
