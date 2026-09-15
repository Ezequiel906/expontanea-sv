import { API_URL } from "../config/api";

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export const getContactMessages = async (
  token: string
): Promise<ContactMessage[]> => {
  const response = await fetch(`${API_URL}/contact/messages`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Error al obtener los mensajes");
  }

  return result.data;
};

export const markContactMessageAsRead = async (
  token: string,
  messageId: number
): Promise<ContactMessage> => {
  const response = await fetch(
    `${API_URL}/contact/messages/${messageId}/read`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Error al actualizar el mensaje");
  }

  return result.data;
};
