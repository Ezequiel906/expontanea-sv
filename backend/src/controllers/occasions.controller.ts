import { Request, Response } from "express";
import { getOccasions } from "../services/occasions.service";

export const getOccasionsController = async (
  _req: Request,
  res: Response
) => {
  try {
    const occasions = await getOccasions();

    res.json({
      success: true,
      data: occasions,
    });
  } catch (error) {
    console.error("Error al obtener ocasiones:", error);

    res.status(500).json({
      success: false,
      message: "Error al obtener las ocasiones",
    });
  }
};