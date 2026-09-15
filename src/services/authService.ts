import type { AuthUser } from "../context/authContext";
import { API_URL } from "../config/api";

interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: AuthUser;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  id: number;
  name: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
}

export const login = async (
  data: LoginData
): Promise<LoginResponse> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Error al iniciar sesión"
    );
  }

  return result.data;
};

export const register = async (
  data: RegisterData
): Promise<RegisterResponse> => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Error al crear la cuenta"
    );
  }

  return result.data;
};

export const requestPasswordReset = async (email: string) => {
  const response = await fetch(`${API_URL}/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "No se pudo procesar la solicitud");
  }

  return result.data;
};

export const resetPassword = async (
  token: string,
  newPassword: string
) => {
  const response = await fetch(`${API_URL}/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token,
      newPassword,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "No se pudo cambiar la contraseña");
  }

  return result.data;
};
