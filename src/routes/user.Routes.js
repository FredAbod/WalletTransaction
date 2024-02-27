import express from "express";
const router = express.Router();
import { loginUser, register } from "../controllers/userController.js";

router.post("/register", register);
router.post("/login", loginUser);

export default router;
