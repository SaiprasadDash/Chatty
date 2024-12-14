import express from "express";
import { signup, login, logout, updateProfile, checkAuth } from "../controllers/auth.controller.js"; // Add updateProfile here
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update-profile", protectRoute, updateProfile); // This line is now correct
router.get("/check", protectRoute, checkAuth);

export default router;