import { Request, Response } from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../services/product.service";
import {
  deleteProductImage,
  uploadProductImage,
} from "../services/image.service";

const normalizeOccasions = (value: unknown) => {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map(String);
  }

  return [String(value)];
};

const normalizeProductBody = (body: Record<string, unknown>) => ({
  name: String(body.name ?? ""),
  description: String(body.description ?? ""),
  price: Number(body.price),
  image: String(body.image ?? ""),
  category: String(body.category ?? ""),
  featured: body.featured === true || body.featured === "true",
  occasions: normalizeOccasions(body.occasions),
});

export const getProductsController = async (
  req: Request,
  res: Response
) => {
  try {
    const occasion =
      typeof req.query.occasion === "string"
        ? req.query.occasion
        : undefined;
    const products = await getProducts(occasion);

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);

    res.status(500).json({
      success: false,
      message: "Error al obtener los productos",
    });
  }
};

export const getProductByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      res.status(400).json({
        success: false,
        message: "ID de producto inválido",
      });
      return;
    }

    const product = await getProductById(id);

    if (!product) {
      res.status(404).json({
        success: false,
        message: "Producto no encontrado",
      });
      return;
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Error al obtener producto:", error);

    res.status(500).json({
      success: false,
      message: "Error al obtener el producto",
    });
  }
};

export const createProductController = async (
  req: Request,
  res: Response
) => {
  try {
    const data = normalizeProductBody(req.body);

    if (req.file) {
      data.image = await uploadProductImage(req.file);
    }

    const product = await createProduct(data);

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Error al crear producto:", error);

    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Error al crear el producto",
    });
  }
};

export const deleteProductController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "ID de producto inválido",
      });
    }

    await deleteProduct(id);

    return res.json({
      success: true,
      message: "Producto eliminado correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar producto:", error);

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Error al eliminar el producto",
    });
  }
};

export const updateProductController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "ID de producto inválido",
      });
    }

    const data = normalizeProductBody(req.body);

    const previousImage = req.file
      ? (await getProductById(id))?.image
      : null;

    if (req.file) {
      data.image = await uploadProductImage(req.file);
    }

    const product = await updateProduct(id, data);

    if (previousImage) {
      deleteProductImage(previousImage).catch((error) => {
        console.error("Error al eliminar imagen anterior:", error);
      });
    }

    return res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Error al actualizar producto:", error);

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Error al actualizar el producto",
    });
  }
};
