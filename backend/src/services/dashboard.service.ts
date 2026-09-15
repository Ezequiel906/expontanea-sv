import { prisma } from "../config/prisma";

export const getDashboardStats = async () => {
  const [
    totalOrders,
    pendingOrders,
    deliveredOrders,
    salesResult,
    recentOrders,
  ] = await Promise.all([
    prisma.order.count(),

    prisma.order.count({
      where: {
        status: "PENDING",
      },
    }),

    prisma.order.count({
      where: {
        status: "DELIVERED",
      },
    }),

    prisma.order.aggregate({
      _sum: {
        total: true,
      },
    }),

    prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        customerName: true,
        total: true,
        status: true,
        createdAt: true,
      },
    }),
  ]);

  return {
    totalOrders,
    pendingOrders,
    deliveredOrders,
    totalSales: Number(salesResult._sum.total ?? 0),
    recentOrders: recentOrders.map((order) => ({
      ...order,
      total: Number(order.total),
    })),
  };
};