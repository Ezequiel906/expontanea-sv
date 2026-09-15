import { prisma } from "../config/prisma";
import type { order, orderitem } from "@prisma/client";

interface CreateOrderItem {
  productId: number;
  quantity: number;
}

interface CreateOrderData {
  customerName: string;
  phone: string;
  email: string;
  deliveryType: string;
  address?: string;
  city?: string;
  notes?: string;
  items: CreateOrderItem[];
  userId?: number;
}

export const createOrder = async (data: CreateOrderData) => {
  if (!data.customerName?.trim()) {
    throw new Error("El nombre es obligatorio");
  }

  if (!data.phone?.trim()) {
    throw new Error("El teléfono es obligatorio");
  }

  if (!data.email?.trim()) {
    throw new Error("El correo es obligatorio");
  }

  if (!["delivery", "pickup"].includes(data.deliveryType)) {
    throw new Error("Tipo de entrega inválido");
  }

  if (data.deliveryType === "delivery") {
    if (!data.address?.trim()) {
      throw new Error("La dirección es obligatoria");
    }

    if (!data.city?.trim()) {
      throw new Error("La ciudad es obligatoria");
    }
  }

  if (!data.items?.length) {
    throw new Error("El pedido debe tener al menos un producto");
  }

  for (const item of data.items) {
    if (!Number.isInteger(item.productId) || item.productId <= 0) {
      throw new Error("ID de producto inválido");
    }

    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      throw new Error("La cantidad debe ser un número entero mayor a 0");
    }
  }

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: data.items.map((item) => item.productId),
      },
    },
  });

  if (products.length !== data.items.length) {
    throw new Error("Uno o más productos no existen");
  }

  const items = data.items.map((item) => {
    const product = products.find(
      (product) => product.id === item.productId
    );

    if (!product) {
      throw new Error(`Producto ${item.productId} no encontrado`);
    }

    return {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
    };
  });

  const total = items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  return prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        customerName: data.customerName.trim(),
        phone: data.phone.trim(),
        email: data.email.trim(),
        deliveryType: data.deliveryType,
        address: data.address?.trim(),
        city: data.city?.trim(),
        notes: data.notes?.trim(),
        total,
        userId: data.userId,
        orderitem: {
          create: items,
        },
      },
      include: {
        orderitem: true,
      },
    });

    return formatOrder(order);
  });
};

const formatOrder = (
  order: order & {
    orderitem: orderitem[];
  }
) => {
  const { orderitem, ...orderData } = order;

  return {
    ...orderData,
    total: Number(order.total),
    items: orderitem.map((item) => ({
      ...item,
      price: Number(item.price),
    })),
  };
};

export const getOrders = async () => {
  const orders = await prisma.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      orderitem: true,
    },
  });

  return orders.map(formatOrder);
};

export const getOrderById = async (id: number) => {
  const order = await prisma.order.findUnique({
    where: {
      id,
    },
    include: {
      orderitem: true,
    },
  });

  if (!order) {
    return null;
  }

  return formatOrder(order);
};

export const updateOrderStatus = async (
  id: number,
  status: string
) => {
  const validStatuses = [
    "PENDING",
    "CONFIRMED",
    "PREPARING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ];

  if (!validStatuses.includes(status)) {
    throw new Error("Estado de pedido inválido");
  }

  const order = await prisma.order.findUnique({
    where: {
      id,
    },
  });

  if (!order) {
    return null;
  }

  const updatedOrder = await prisma.order.update({
    where: {
      id,
    },
    data: {
      status: status as
        | "PENDING"
        | "CONFIRMED"
        | "PREPARING"
        | "SHIPPED"
        | "DELIVERED"
        | "CANCELLED",
    },
    include: {
      orderitem: true,
    },
  });

  return formatOrder(updatedOrder);
};

export const getOrdersByUserId = async (userId: number) => {
  const orders = await prisma.order.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      orderitem: true,
    },
  });

  return orders.map(formatOrder);
};
