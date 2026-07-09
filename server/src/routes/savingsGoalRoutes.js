import { Router } from "express";
import {
  createSavingsGoal,
  deleteSavingsGoal,
  listSavingsGoals,
  updateSavingsGoal,
  updateSavingsGoalProgress
} from "../controllers/savingsGoalController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);

router.get("/", listSavingsGoals);
router.post("/", createSavingsGoal);
router.put("/:id", updateSavingsGoal);
router.patch("/:id/progress", updateSavingsGoalProgress);
router.delete("/:id", deleteSavingsGoal);

export default router;
