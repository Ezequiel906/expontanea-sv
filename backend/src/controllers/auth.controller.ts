import { Request, Response } from "express";
import {
  login,
  register,
  requestPasswordReset,
  resetPassword,
} from "../services/auth.service";

const publicAuthMessages = new Set([
  "El correo es obligatorio",
  "La contraseña es obligatoria",
  "Correo o contraseña incorrectos",
  "El nombre es obligatorio",
  "La contraseña debe tener al menos 6 caracteres",
  "Ya existe una cuenta con ese correo",
  "No existe una cuenta con ese correo",
  "FRONTEND_URL no está configurado",
  "El token de recuperación es obligatorio",
  "La nueva contraseña es obligatoria",
  "El enlace de recuperación no es válido o ha expirado",
]);

const getSafeAuthMessage = (
  error: unknown,
  fallbackMessage: string
) => {
  if (!(error instanceof Error)) {
    return fallbackMessage;
  }

  if (publicAuthMessages.has(error.message)) {
    return error.message;
  }

  if (
    "code" in error ||
    error.message.includes("prisma.") ||
    error.message.includes("Database error") ||
    error.message.includes("pool timeout")
  ) {
    return "No se pudo conectar con la base de datos. Intenta nuevamente en unos segundos.";
  }

  return fallbackMessage;
};

export const loginController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await login(req.body);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);

    res.status(401).json({
      success: false,
      message: getSafeAuthMessage(error, "Error al iniciar sesión"),
    });
  }
};

export const registerController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await register(req.body);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error al registrar usuario:", error);

    res.status(400).json({
      success: false,
      message: getSafeAuthMessage(error, "Error al registrar usuario"),
    });
  }
};

export const requestPasswordResetController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await requestPasswordReset(req.body.email);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error al solicitar recuperación:", error);

    res.status(400).json({
      success: false,
      message: getSafeAuthMessage(
        error,
        "Error al solicitar recuperación"
      ),
    });
  }
};

export const resetPasswordController = async (
  req: Request,
  res: Response
) => {
  try {
    const { token, newPassword } = req.body;

    const result = await resetPassword(token, newPassword);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error al restablecer contraseña:", error);

    res.status(400).json({
      success: false,
      message: getSafeAuthMessage(
        error,
        "Error al restablecer contraseña"
      ),
    });
  }
};
