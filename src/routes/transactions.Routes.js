import express from "express";
import { credit, debit, transfer } from "../controllers/transactions.controller.js";
const router = express.Router();


router.post("/credit/:walletId", credit);
router.post("/debit/:userId", debit);
router.post("/transfer", transfer);


export default router;
