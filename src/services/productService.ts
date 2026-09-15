import type { Product } from "../types/product";
import { API_URL } from "../config/api";

export const getProducts = async (occasion?: string): Promise<Product[]> => {
  const params = new URLSearchParams();

  if (occasion) {
    params.set("occasion", occasion);
  }

  const query = params.toString();
  const response = await fetch(
    `${API_URL}/products${query ? `?${query}` : ""}`
  );

  if (!response.ok) {
    throw new Error("Error al obtener los productos");
  }

  const result = await response.json();

  return result.data.map((product: Product) => ({
    ...product,
    price: Number(product.price),
  }));
};

export const getProductById = async (
  id: number
): Promise<Product> => {
  const response = await fetch(`${API_URL}/products/${id}`);

  if (!response.ok) {
    throw new Error("Error al obtener el producto");
  }

  const result = await response.json();

  return {
    ...result.data,
    price: Number(result.data.price),
  };
};

interface CreateProductData {
  name: string;
  description: string;
  price: number;
  image?: string;
  imageFile?: File | null;
  category: string;
  featured?: boolean;
  occasions?: string[];
}

const buildProductFormData = (data: CreateProductData) => {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("description", data.description);
  formData.append("price", String(data.price));
  formData.append("category", data.category);
  formData.append("featured", String(data.featured ?? false));

  if (data.image && !data.imageFile) {
    formData.append("image", data.image);
  }

  if (data.imageFile) {
    formData.append("image", data.imageFile);
  }

  data.occasions?.forEach((occasion) => {
    formData.append("occasions", occasion);
  });

  return formData;
};

export const createProduct = async (
  token: string,
  data: CreateProductData
): Promise<Product> => {
  const response = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: buildProductFormData(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Error al crear el producto"
    );
  }

  return {
    ...result.data,
    price: Number(result.data.price),
  };
};

export const deleteProduct = async (
  token: string,
  id: number
): Promise<void> => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Error al eliminar el producto"
    );
  }
};

export const updateProduct = async (
  token: string,
  id: number,
  data: CreateProductData
): Promise<Product> => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: buildProductFormData(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Error al actualizar el producto"
    );
  }

  return {
    ...result.data,
    price: Number(result.data.price),
  };
};
