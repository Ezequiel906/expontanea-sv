import { API_URL } from "../config/api";

export interface Occasion {
  id: number;
  name: string;
}

export const getOccasions = async (): Promise<Occasion[]> => {
  const response = await fetch(`${API_URL}/occasions`);

  if (!response.ok) {
    throw new Error("Error al obtener las ocasiones");
  }

  const result = await response.json();

  return result.data;
};
