import mongoose from "mongoose";
import Wallet from "../models/wallet.js";
import Transaction from "../models/trasactions.Models.js"; 
import User from "../models/user.Models.js";

const credit = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { amount, type, description } = req.body;
    const walletId = req.params.walletId;

    if (!amount || !type || !description) {
      return res.status(400).json({
        error: "Invalid input",
        message: "Please enter an amount and a type.",
      });
    }

    const wallet = await Wallet.findOne({ _id: walletId }).session(session);

    if (!wallet) {
      return res.status(400).json({
        error: "Wallet not found",
        message: "Please create a new wallet",
      });
    }

    const balanceBefore = wallet.balance;

    const updatedWallet = await Wallet.findOneAndUpdate(
      { _id: wallet._id },
      { $inc: { balance: amount } },
      { new: true, session } // Ensure you get the updated document
    );

    const balanceAfter = updatedWallet.balance;

    const newTransaction = new Transaction({
      user: wallet.userId,
      amount,
      type,
      balanceBefore,
      balanceAfter,
      description,
    });

    await newTransaction.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Wallet Credited",
      data: updatedWallet,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

const debit = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { amount, type, description } = req.body;
    const userId = req.params.userId;

    if (!amount || !type || !description) {
      return res.status(400).json({
        error: "Invalid input",
        message: "Please enter an amount and a type.",
      });
    }

    const wallet = await Wallet.findOne({ userId }).session(session);

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

    const balanceBefore = wallet.balance;

    const updatedWallet = await Wallet.findOneAndUpdate(
      { _id: wallet._id },
      { $inc: { balance: -amount } },
      { new: true, session }
    );

    const balanceAfter = updatedWallet.balance;

    const newTransaction = new Transaction({
      user: userId,
      amount,
      type,
      balanceBefore,
      balanceAfter,
      description
    });

    await newTransaction.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Wallet Debited",
      data: updatedWallet,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

//  Transferring From User To USer
const transfer = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { senderUsername, amount, receiverUsername } = req.body;

    if (!senderUsername || !amount || !receiverUsername) {
      return res.status(400).json({
        error: "Invalid input",
        message: "Please provide senderUsername, amount, and receiverUsername.",
      });
    }

const senderId = await User.findOne({ userName: senderUsername}).session(session);
console.log(senderId._id);
// const senderObjectId = mongoose.Types.ObjectId(senderId._id);
// console.log(senderObjectId);
    // Find sender's wallet
    const senderWallet = await Wallet.findOne({ userId: senderId._id }).session(session);

    if (!senderWallet) {
      return res.status(400).json({
        error: "Sender's Wallet not found",
        message: "Please create a wallet for the sender",
      });
    }

    // Check if sender has sufficient balance
    if (senderWallet.balance < amount) {
      return res.status(400).json({
        error: "Insufficient balance",
        message: "Sender has insufficient balance for this transaction",
      });
    }

    const recieverId = await User.findOne({ userName: senderUsername}).session(session);


    // Find receiver's wallet
    const receiverWallet = await Wallet.findOne({ userId: recieverId._id }).session(session);

    if (!receiverWallet) {
      return res.status(400).json({
        error: "Receiver's Wallet not found",
        message: "Please create a wallet for the receiver",
      });
    }

    // Debit the sender's wallet
    const updatedSenderWallet = await Wallet.findOneAndUpdate(
      { _id: senderWallet._id },
      { $inc: { balance: -amount } },
      { new: true, session }
    );

    // Credit the receiver's wallet
    const updatedReceiverWallet = await Wallet.findOneAndUpdate(
      { _id: receiverWallet._id },
      { $inc: { balance: amount } },
      { new: true, session }
    );

    // Save transaction details
    const newTransaction = new Transaction({
      user: senderUsername,
      amount,
      type: "transfer",
      balanceBefore: senderWallet.balance,
      balanceAfter: updatedSenderWallet.balance,
      description: `Transfer to ${receiverUsername}`,
    });

    await newTransaction.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Transfer successful",
      data: {
        sender: updatedSenderWallet,
        receiver: updatedReceiverWallet,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export { credit, debit, transfer };
