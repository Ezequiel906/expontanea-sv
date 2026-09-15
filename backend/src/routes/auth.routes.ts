import { Router } from "express";
import {
  loginController,
  registerController,
  requestPasswordResetController,
  resetPasswordController,
} from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middlewares";
import { authorizeRoles } from "../middlewares/role.middleware";


const router = Router();

router.post("/login", loginController);
router.post("/register", registerController);
router.post("/forgot-password", requestPasswordResetController);
router.post("/reset-password", resetPasswordController);

router.get("/me", authenticate, (req, res) => {
  res.json({
    success: true,
    data: req.user,
  });
});

router.get(
  "/admin-test",
  authenticate,
  authorizeRoles("ADMIN"),
  (_req, res) => {
    res.json({
      success: true,
      message: "Tienes acceso de administrador",
    });
  }
);

export default router;