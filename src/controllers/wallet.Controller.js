import User from "../models/user.Models.js";
import Wallet from "../models/wallet.js";

const createWallet = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        error: "Invalid input",
        message: "ID is required",
      });
    }

    const user = await User.findById({ _id: id });
    if (!user) {
      return res.status(400).json({
        error: "User Not Found",
        message: "User does not exist",
      });
    }
    const wallet = new Wallet({
      userId: user.id,
    });

    await wallet.save();
    return res.status(201).json({
      success: true,
      message: "Wallet created successfully",
      data: wallet,
    });
  } catch (error) {
    next(error);
  }
};

export { createWallet };
