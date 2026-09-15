import { Router } from "express";
import {
  createOrderController,
  getOrderByIdController,
  getMyOrdersController,
  getOrdersController,
  updateOrderStatusController,
} from "../controllers/order.controller";

import { authorizeRoles } from "../middlewares/role.middleware";
import {
  authenticate,
  optionalAuthenticate,
} from "../middlewares/auth.middlewares";

const router = Router();

router.get(
  "/",
  authenticate,
  authorizeRoles("ADMIN"),
  getOrdersController
);

router.get("/me", authenticate, getMyOrdersController);

router.get(
  "/:id",
  authenticate,
  authorizeRoles("ADMIN"),
  getOrderByIdController
);
router.post("/", optionalAuthenticate, createOrderController);
router.patch(
  "/:id/status",
  authenticate,
  authorizeRoles("ADMIN"),
  updateOrderStatusController
);

export default router;
