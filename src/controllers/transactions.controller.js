import Wallet from "../models/wallet.js";
import Transaction from "../models/trasactions.Models.js";

const credit = async (req, res, next) => {
  try {
    const { amount, type } = req.body;
    const userId = req.params.userId;

    if (!amount || !type) {
      return res.status(400).json({
        error: "Invalid input",
        message: "Please enter an amount and a type.",
      });
    }

    const wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      return res.status(400).json({
        error: "Wallet not found",
        message: "Please create a new wallet",
      });
    }

    const updatedWallet = await Wallet.findOneAndUpdate(
      { _id: wallet._id },
      { $inc: { balance: amount } },
      { new: true } // Ensure you get the updated document
    );

    const newTransaction = new Transaction({
      user: userId,
      amount,
      type,
    });

    await newTransaction.save();

    return res.status(200).json({
      success: true,
      message: "Wallet Credited",
      data: updatedWallet,
    });
  } catch (error) {
    next(error);
  }
};

const debit = async (req, res, next) => {
  try {
    const { amount, type } = req.body;
    const userId = req.params.userId;

    if (!amount || !type) {
      return res.status(400).json({
        error: "Invalid input",
        message: "Please enter an amount and a type.",
      });
    }

    const wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      return res.status(400).json({
        error: "Wallet not found",
        message: "Please create a new wallet",
      });
    }

    if (wallet.balance < amount) {
      return res.status(400).json({
        error: "Insufficient balance",
        message: "User has insufficient balance for this transaction",
      });
    }

    const updatedWallet = await Wallet.findOneAndUpdate(
      { _id: wallet._id },
      { $inc: { balance: -amount } },
      { new: true }
    );

    const newTransaction = new Transaction({
      user: userId,
      amount,
      type,
    });

    await newTransaction.save();

    return res.status(200).json({
      success: true,
      message: "Wallet Debited",
      data: updatedWallet,
    });
  } catch (error) {
    next(error);
  }
};

export { credit, debit };
