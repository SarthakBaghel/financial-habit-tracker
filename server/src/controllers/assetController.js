import asyncHandler from "../utils/asyncHandler.js";
import Asset from "../models/Asset.js";

const ASSET_TYPES = ["savings", "investment", "asset"];

function validateAssetPayload(payload, partial = false) {
  if (!partial && !payload.name) {
    throw new Error("Asset name is required.");
  }

  if (!partial && !payload.type) {
    throw new Error("Asset type is required.");
  }

  if (!partial && payload.value === undefined) {
    throw new Error("Asset value is required.");
  }

  if (payload.type !== undefined && !ASSET_TYPES.includes(payload.type)) {
    throw new Error("Asset type must be savings, investment, or asset.");
  }

  if (payload.value !== undefined && Number(payload.value) < 0) {
    throw new Error("Asset value cannot be negative.");
  }
}

function mapAsset(asset) {
  return {
    id: asset._id,
    name: asset.name,
    type: asset.type,
    value: asset.value,
    date: asset.date,
    createdAt: asset.createdAt,
    updatedAt: asset.updatedAt
  };
}

export const listAssets = asyncHandler(async (req, res) => {
  const filters = { userId: req.user._id };

  if (req.query.type) {
    filters.type = req.query.type;
  }

  const assets = await Asset.find(filters).sort({ date: -1, createdAt: -1 }).lean();

  res.status(200).json({
    assets: assets.map(mapAsset),
    assetTypes: ASSET_TYPES
  });
});

export const createAsset = asyncHandler(async (req, res) => {
  try {
    validateAssetPayload(req.body);
  } catch (error) {
    res.status(400);
    throw error;
  }

  const asset = await Asset.create({
    userId: req.user._id,
    name: req.body.name,
    type: req.body.type,
    value: Number(req.body.value),
    date: req.body.date || new Date()
  });

  res.status(201).json({ asset: mapAsset(asset) });
});

export const updateAsset = asyncHandler(async (req, res) => {
  try {
    validateAssetPayload(req.body, true);
  } catch (error) {
    res.status(400);
    throw error;
  }

  const payload = { ...req.body };

  if (payload.value !== undefined) {
    payload.value = Number(payload.value);
  }

  const asset = await Asset.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    payload,
    { new: true, runValidators: true }
  );

  if (!asset) {
    res.status(404);
    throw new Error("Asset entry not found.");
  }

  res.status(200).json({ asset: mapAsset(asset) });
});

export const deleteAsset = asyncHandler(async (req, res) => {
  const asset = await Asset.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

  if (!asset) {
    res.status(404);
    throw new Error("Asset entry not found.");
  }

  res.status(200).json({ message: "Asset entry deleted." });
});
