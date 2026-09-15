import { Request, Response } from "express";
import {
  createOrder,
  getOrderById,
  getOrdersByUserId,
  getOrders,
  updateOrderStatus,
} from "../services/order.service";

export const createOrderController = async (
  req: Request,
  res: Response
) => {
  try {
    const order = await createOrder({
      ...req.body,
      userId: req.user?.userId,
    });

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Error al crear pedido:", error);

    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Error al crear el pedido",
    });
  }
};

export const getMyOrdersController = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Autenticación requerida",
      });
      return;
    }

    const orders = await getOrdersByUserId(req.user.userId);

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Error al obtener pedidos del usuario:", error);

    res.status(500).json({
      success: false,
      message: "Error al obtener tus pedidos",
    });
  }
};

export const getOrdersController = async (
  _req: Request,
  res: Response
) => {
  try {
    const orders = await getOrders();

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Error al obtener pedidos:", error);

    res.status(500).json({
      success: false,
      message: "Error al obtener los pedidos",
    });
  }
};

export const getOrderByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      res.status(400).json({
        success: false,
        message: "ID de pedido inválido",
      });
      return;
    }

    const order = await getOrderById(id);

    if (!order) {
      res.status(404).json({
        success: false,
        message: "Pedido no encontrado",
      });
      return;
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Error al obtener pedido:", error);

    res.status(500).json({
      success: false,
      message: "Error al obtener el pedido",
    });
  }
};

export const updateOrderStatusController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    if (Number.isNaN(id)) {
      res.status(400).json({
        success: false,
        message: "ID de pedido inválido",
      });
      return;
    }

    if (!status) {
      res.status(400).json({
        success: false,
        message: "El estado es obligatorio",
      });
      return;
    }

    const order = await updateOrderStatus(id, status);

    if (!order) {
      res.status(404).json({
        success: false,
        message: "Pedido no encontrado",
      });
      return;
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Error al actualizar estado del pedido:", error);

    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Error al actualizar el estado del pedido",
    });
  }
};
