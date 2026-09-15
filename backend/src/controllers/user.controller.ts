import { Request, Response } from "express";
import {
  createUser,
  getUsers,
} from "../services/user.service";

export const createUserController = async (
  req: Request,
  res: Response
) => {
  try {
    const user = await createUser(req.body);

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error al crear usuario:", error);

    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Error al crear el usuario",
    });
  }
};

export const getUsersController = async (
  _req: Request,
  res: Response
) => {
  try {
    const users = await getUsers();

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Error al obtener usuarios:", error);

    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Error al obtener los usuarios",
    });
  }
};