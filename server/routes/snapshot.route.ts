import express from "express";
import verifyToken from "../middleware/verifyToken";
import {
  createSnapshotWeatherToday,
  getSnapshotWeatherToday,
} from "../models/snapshot.model";

const router = express.Router();

router.post("/new-snapshot", verifyToken, createSnapshotWeatherToday);
router.get("/historical-snapshot", verifyToken, getSnapshotWeatherToday);

export default router;
