import { Router } from "express";
import { getOccasionsController } from "../controllers/occasions.controller";


const router = Router();

router.get("/", getOccasionsController);

export default router;