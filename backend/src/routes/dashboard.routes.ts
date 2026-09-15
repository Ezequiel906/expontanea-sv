import { Router } from "express";
import { getDashboardStatsController } from "../controllers/dashboard.controller";

import { authorizeRoles } from "../middlewares/role.middleware";
import { authenticate } from "../middlewares/auth.middlewares";

const router = Router();

router.get(
  "/",
  authenticate,
  authorizeRoles("ADMIN"),
  getDashboardStatsController
);

export default router;