import { Router } from "express";
import {
  getAdminSummary,
  listAdminFeedback,
  listAdminUsers,
  updateFeedbackStatus
} from "../controllers/adminController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect, requireRole("admin"));

router.get("/summary", getAdminSummary);
router.get("/users", listAdminUsers);
router.get("/feedback", listAdminFeedback);
router.patch("/feedback/:id", updateFeedbackStatus);

export default router;
