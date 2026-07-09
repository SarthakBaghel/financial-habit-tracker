import { Router } from "express";
import { createAsset, deleteAsset, listAssets, updateAsset } from "../controllers/assetController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);

router.get("/", listAssets);
router.post("/", createAsset);
router.put("/:id", updateAsset);
router.delete("/:id", deleteAsset);

export default router;
