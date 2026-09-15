import { Request, Response, NextFunction } from "express";
import type { user_role } from "@prisma/client";

export const authorizeRoles = (...allowedRoles: user_role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Usuario no autenticado",
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: "No tienes permisos para realizar esta acción",
      });
      return;
    }

    next();
  };
};
