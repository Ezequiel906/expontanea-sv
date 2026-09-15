import bcrypt from "bcrypt";
import { prisma } from "../config/prisma";

interface CreateUserData {
  name: string;
  email: string;
  password: string;
}

export const createUser = async (data: CreateUserData) => {
  if (!data.name?.trim()) {
    throw new Error("El nombre es obligatorio");
  }

  if (!data.email?.trim()) {
    throw new Error("El correo es obligatorio");
  }

  if (!data.password || data.password.length < 6) {
    throw new Error(
      "La contraseña debe tener al menos 6 caracteres"
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email.trim().toLowerCase(),
    },
  });

  if (existingUser) {
    throw new Error("El correo ya está registrado");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  return prisma.user.create({
    data: {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      password: hashedPassword,
      updatedAt: new Date(),
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const getUsers = async () => {
  return prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          order: true,
        },
      },
    },
  }).then((users) =>
    users.map(({ _count, ...user }) => ({
      ...user,
      ordersCount: _count.order,
    }))
  );
};
