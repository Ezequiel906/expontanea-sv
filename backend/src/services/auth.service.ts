import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma";
import crypto from "crypto";
import { sendPasswordResetEmail } from "./email.service";


interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export const login = async (data: LoginData) => {
  if (!data.email?.trim()) {
    throw new Error("El correo es obligatorio");
  }

  if (!data.password) {
    throw new Error("La contraseña es obligatoria");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: data.email.trim().toLowerCase(),
    },
  });

  if (!user) {
    throw new Error("Correo o contraseña incorrectos");
  }

  const passwordValid = await bcrypt.compare(
    data.password,
    user.password
  );

  if (!passwordValid) {
    throw new Error("Correo o contraseña incorrectos");
  }

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "7d",
    }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

export const register = async (data: RegisterData) => {
  if (!data.name?.trim()) {
    throw new Error("El nombre es obligatorio");
  }

  if (!data.email?.trim()) {
    throw new Error("El correo es obligatorio");
  }

  if (!data.password) {
    throw new Error("La contraseña es obligatoria");
  }

  if (data.password.length < 6) {
    throw new Error("La contraseña debe tener al menos 6 caracteres");
  }

  const email = data.email.trim().toLowerCase();

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Ya existe una cuenta con ese correo");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name.trim(),
      email,
      password: hashedPassword,
      role: "CUSTOMER",
      updatedAt: new Date(),
    },
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

export const requestPasswordReset = async (email: string) => {
  if (!email?.trim()) {
    throw new Error("El correo es obligatorio");
  }

  const normalizedEmail = email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    throw new Error("No existe una cuenta con ese correo");
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  const resetTokenExpiresAt = new Date(
    Date.now() + 1000 * 60 * 30
  );

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetToken,
      resetTokenExpiresAt,
    },
  });

  const frontendUrl = process.env.FRONTEND_URL;

  if (!frontendUrl) {
    throw new Error("FRONTEND_URL no está configurado");
  }

  const resetLink = `${frontendUrl.replace(
    /\/$/,
    ""
  )}/reset-password?token=${resetToken}`;

  await sendPasswordResetEmail(user.email, resetLink);

  return {
    email: user.email,
    resetLink,
  };
};

export const resetPassword = async (
  token: string,
  newPassword: string
) => {
  if (!token) {
    throw new Error("El token de recuperación es obligatorio");
  }

  if (!newPassword) {
    throw new Error("La nueva contraseña es obligatoria");
  }

  if (newPassword.length < 6) {
    throw new Error(
      "La contraseña debe tener al menos 6 caracteres"
    );
  }

  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiresAt: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    throw new Error(
      "El enlace de recuperación no es válido o ha expirado"
    );
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiresAt: null,
    },
  });

  return {
    message: "Contraseña actualizada correctamente",
  };
};
