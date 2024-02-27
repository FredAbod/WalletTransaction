import express from "express";
import { createWallet } from "../controllers/wallet.Controller.js";
const router = express.Router();


router.post("/create/:id", createWallet);


export default router;
