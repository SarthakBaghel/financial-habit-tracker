import { Router } from "express";
import { getAdminSummary } from "../controllers/adminController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/summary", protect, requireRole("admin"), getAdminSummary);

export default router;
