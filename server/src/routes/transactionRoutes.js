import { Router } from "express";
import {
  createTransaction,
  deleteTransaction,
  getTransactionSummary,
  listTransactions,
  updateTransaction
} from "../controllers/transactionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);

router.get("/", listTransactions);
router.post("/", createTransaction);
router.get("/summary", getTransactionSummary);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

export default router;
