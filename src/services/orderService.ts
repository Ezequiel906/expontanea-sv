import { API_URL } from "../config/api";
import type { AdminOrder } from "../types/adminOrder";

interface CreateOrderItem {
  productId: number;
  quantity: number;
}

export interface CreateOrderData {
  customerName: string;
  phone: string;
  email: string;
  deliveryType: string;
  address?: string;
  city?: string;
  notes?: string;
  items: CreateOrderItem[];
}

export const createOrder = async (
  order: CreateOrderData,
  token?: string | null,
) => {
  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(order),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Error al crear el pedido");
  }

  return result.data as AdminOrder;
};

export const getMyOrders = async (token: string) => {
  const response = await fetch(`${API_URL}/orders/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Error al obtener tus pedidos");
  }

  return result.data as AdminOrder[];
};
