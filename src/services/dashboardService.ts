import { API_URL } from "../config/api";

export interface RecentOrder {
  id: number;
  customerName: string;
  total: number;
  status:
    | "PENDING"
    | "CONFIRMED"
    | "PREPARING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";
  createdAt: string;
}

export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  totalSales: number;
  recentOrders: RecentOrder[];
}

export const getDashboardStats = async (
  token: string
): Promise<DashboardStats> => {
  const response = await fetch(`${API_URL}/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Error al obtener las estadísticas"
    );
  }

  return result.data;
};
