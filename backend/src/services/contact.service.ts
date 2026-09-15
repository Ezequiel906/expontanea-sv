import { prisma } from "../config/prisma";
import { sendContactEmail } from "./email.service";

interface ContactMessageData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getContactMessageDelegate = () => {
  if (!prisma.contactmessage) {
    throw new Error(
      "El modelo contactmessage no está disponible. Ejecuta la migración, genera Prisma Client y reinicia el backend."
    );
  }

  return prisma.contactmessage;
};

export const sendContactMessage = async (data: ContactMessageData) => {
  if (!data.name?.trim()) {
    throw new Error("El nombre es obligatorio");
  }

  if (!data.email?.trim() || !emailRegex.test(data.email)) {
    throw new Error("Ingresa un correo válido");
  }

  if (!data.subject?.trim()) {
    throw new Error("El asunto es obligatorio");
  }

  if (!data.message?.trim()) {
    throw new Error("El mensaje es obligatorio");
  }

  const contactMessage = getContactMessageDelegate();

  const message = await contactMessage.create({
    data: {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      subject: data.subject.trim(),
      message: data.message.trim(),
    },
  });

  await sendContactEmail({
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    subject: data.subject.trim(),
    message: data.message.trim(),
  });

  return message;
};

export const getContactMessages = async () => {
  const contactMessage = getContactMessageDelegate();

  return contactMessage.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getContactMessageById = async (id: number) => {
  const contactMessage = getContactMessageDelegate();

  return contactMessage.findUnique({
    where: {
      id,
    },
  });
};

export const markContactMessageAsRead = async (id: number) => {
  const contactMessage = getContactMessageDelegate();

  const message = await contactMessage.findUnique({
    where: {
      id,
    },
  });

  if (!message) {
    return null;
  }

  return contactMessage.update({
    where: {
      id,
    },
    data: {
      isRead: true,
    },
  });
};
