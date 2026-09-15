import { Router } from "express";
import {
  getContactMessageByIdController,
  getContactMessagesController,
  markContactMessageAsReadController,
  sendContactMessageController,
} from "../controllers/contact.controller";
import { authenticate } from "../middlewares/auth.middlewares";
import { authorizeRoles } from "../middlewares/role.middleware";

const router = Router();

router.post("/", sendContactMessageController);
router.get(
  "/messages",
  authenticate,
  authorizeRoles("ADMIN"),
  getContactMessagesController
);
router.get(
  "/messages/:id",
  authenticate,
  authorizeRoles("ADMIN"),
  getContactMessageByIdController
);
router.patch(
  "/messages/:id/read",
  authenticate,
  authorizeRoles("ADMIN"),
  markContactMessageAsReadController
);

export default router;
