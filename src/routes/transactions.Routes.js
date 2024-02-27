import express from "express";
import { credit, debit } from "../controllers/transactions.controller.js";
const router = express.Router();


router.post("/credit/:userId", credit);
router.post("/debit/:userId", debit);


export default router;
