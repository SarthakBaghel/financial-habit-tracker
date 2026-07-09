import { Router } from "express";
import { getWealthAnalytics } from "../controllers/analyticsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/wealth", protect, getWealthAnalytics);

export default router;
