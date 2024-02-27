import mongoose from "mongoose";
import { Decimal128 } from "mongoose";

const walletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    balance: {
      type: mongoose.Decimal128,
      required: true,
      default: 0.0,
    },
  },
  { timestamps: true, versionKey: false }
);

const Wallet = mongoose.model("Wallet", walletSchema);

export default Wallet;
