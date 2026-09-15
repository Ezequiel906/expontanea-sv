import { Request, Response } from "express";
import {
  getContactMessageById,
  getContactMessages,
  markContactMessageAsRead,
  sendContactMessage,
} from "../services/contact.service";

export const sendContactMessageController = async (
  req: Request,
  res: Response
) => {
  try {
    await sendContactMessage(req.body);

    res.status(201).json({
      success: true,
      message: "Mensaje enviado correctamente",
    });
  } catch (error) {
    console.error("Error al enviar mensaje de contacto:", error);

    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "No se pudo enviar el mensaje",
    });
  }
};

export const getContactMessagesController = async (
  _req: Request,
  res: Response
) => {
  try {
    const messages = await getContactMessages();

    res.json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error("Error al obtener mensajes de contacto:", error);

    res.status(500).json({
      success: false,
      message: "Error al obtener los mensajes",
    });
  }
};

export const getContactMessageByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      res.status(400).json({
        success: false,
        message: "ID de mensaje inválido",
      });
      return;
    }

    const message = await getContactMessageById(id);

    if (!message) {
      res.status(404).json({
        success: false,
        message: "Mensaje no encontrado",
      });
      return;
    }

    res.json({
      success: true,
      data: message,
    });
  } catch (error) {
    console.error("Error al obtener mensaje de contacto:", error);

    res.status(500).json({
      success: false,
      message: "Error al obtener el mensaje",
    });
  }
};

export const markContactMessageAsReadController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      res.status(400).json({
        success: false,
        message: "ID de mensaje inválido",
      });
      return;
    }

    const message = await markContactMessageAsRead(id);

    if (!message) {
      res.status(404).json({
        success: false,
        message: "Mensaje no encontrado",
      });
      return;
    }

    res.json({
      success: true,
      data: message,
    });
  } catch (error) {
    console.error("Error al marcar mensaje como leído:", error);

    res.status(500).json({
      success: false,
      message: "Error al actualizar el mensaje",
    });
  }
};
