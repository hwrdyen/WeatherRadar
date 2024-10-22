import express from "express";
import {
  deletePersonalProfile,
  getPersonalProfile,
} from "../models/user.model";
import verifyToken from "../middleware/verifyToken";

const router = express.Router();

router.get("/my-profile", verifyToken, getPersonalProfile);
router.delete("/delete-profile", verifyToken, deletePersonalProfile);

export default router;
