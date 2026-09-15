import { Router } from "express";

import {
  createUserController,
  getUsersController,
} from "../controllers/user.controller";


import { authorizeRoles } from "../middlewares/role.middleware";
import { authenticate } from "../middlewares/auth.middlewares";

const router = Router();

router.post("/", createUserController);

router.get(
  "/",
  authenticate,
  authorizeRoles("ADMIN"),
  getUsersController
);

export default router;