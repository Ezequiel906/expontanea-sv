import type { AdminOrder } from "../types/adminOrder";
import { API_URL } from "../config/api";

export const getAdminOrders = async (
  token: string
): Promise<AdminOrder[]> => {
  const response = await fetch(`${API_URL}/orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener los pedidos");
  }

  const result = await response.json();

  return result.data;
};

export const getAdminOrderById = async (
  token: string,
  orderId: number
): Promise<AdminOrder> => {
  const response = await fetch(`${API_URL}/orders/${orderId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Error al obtener el pedido");
  }

  return result.data;
};

export const updateOrderStatus = async (
  token: string,
  orderId: number,
  status: AdminOrder["status"]
): Promise<AdminOrder> => {
  const response = await fetch(
    `${API_URL}/orders/${orderId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Error al actualizar el estado del pedido"
    );
  }

  return result.data;
};
