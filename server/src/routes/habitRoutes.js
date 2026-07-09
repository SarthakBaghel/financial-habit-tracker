import { Router } from "express";
import {
  createHabit,
  deleteHabit,
  getHabitSummary,
  listHabits,
  logHabitCompletion,
  updateHabit
} from "../controllers/habitController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);

router.get("/", listHabits);
router.post("/", createHabit);
router.get("/summary", getHabitSummary);
router.put("/:id", updateHabit);
router.delete("/:id", deleteHabit);
router.post("/:id/log", logHabitCompletion);

export default router;
