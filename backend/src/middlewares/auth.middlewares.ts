import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: number;
  role: "CUSTOMER" | "ADMIN";
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    res.status(401).json({
      success: false,
      message: "Token de autenticación requerido",
    });
    return;
  }

  const [type, token] = authorization.split(" ");

  if (type !== "Bearer" || !token) {
    res.status(401).json({
      success: false,
      message: "Formato de token inválido",
    });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    req.user = decoded;

    next();
  } catch (error) {
    console.error("Error al verificar token:", error);

    res.status(401).json({
      success: false,
      message: "Token inválido o expirado",
    });
  }
};

export const optionalAuthenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    next();
    return;
  }

  const [type, token] = authorization.split(" ");

  if (type !== "Bearer" || !token) {
    next();
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    req.user = decoded;
  } catch (error) {
    console.error("Error al verificar token opcional:", error);
  }

  next();
};
