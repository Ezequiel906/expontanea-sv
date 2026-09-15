import { Router } from "express";
import {
  createProductController,
  deleteProductController,
  getProductByIdController,
  getProductsController,
  updateProductController,
} from "../controllers/product.controller";

import { authorizeRoles } from "../middlewares/role.middleware";
import { authenticate } from "../middlewares/auth.middlewares";
import { uploadProductImageFile } from "../middlewares/upload.middleware";

const router = Router();

router.post(
  "/",
  authenticate,
  authorizeRoles("ADMIN"),
  uploadProductImageFile,
  createProductController
);

router.put(
  "/:id",
  authenticate,
  authorizeRoles("ADMIN"),
  uploadProductImageFile,
  updateProductController
);

router.get("/", getProductsController);

router.delete(
  "/:id",
  authenticate,
  authorizeRoles("ADMIN"),
  deleteProductController
);

router.get("/:id", getProductByIdController);

export default router;
