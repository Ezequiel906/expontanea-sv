import { Request, Response } from "express";
import { getDashboardStats } from "../services/dashboard.service";

export const getDashboardStatsController = async (
  _req: Request,
  res: Response
) => {
  try {
    const stats = await getDashboardStats();

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error(
      "Error al obtener estadísticas del dashboard:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Error al obtener las estadísticas",
    });
  }
};