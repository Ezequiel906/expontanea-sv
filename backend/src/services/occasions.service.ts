import { prisma } from "../config/prisma";

export const getOccasions = async () => {
  return prisma.occasion.findMany({
    orderBy: {
      id: "asc",
    },
  });
};