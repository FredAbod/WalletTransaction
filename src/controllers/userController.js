import User from '../models/user.Models.js';
import bcrypt from "bcryptjs"

const checkExistingUser = async (email) => {
  return User.findOne({ email });
};

const register = async (req, res, next) => {
  try {
    const { userName, email, password } = req.body;

    if (!userName || !email || !password) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Please enter a username, email address, and password.',
      });
    }

    const existingUser = await checkExistingUser(email);
    if (existingUser) {
      return res.status(400).json({
        error: 'User already exists',
        message: 'A user with this email address already exists.',
      });
    }

    const newUser = await User.create({
      userName,
      email,
      password,
    });

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: newUser,
    });
  } catch (error) {
    next(error); // Pass the error to the error-handling middleware
  }
};

const loginUser = async (req, res, next) => {
    try {
      const { email, password } = req.body;
  
      // Find user by email
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found', message: 'Invalid credentials' });
      }
  
      // Compare passwords
      const isPasswordMatch = await bcrypt.compare(password, user.password);
  
      if (!isPasswordMatch) {
        return res.status(401).json({ error: 'Invalid password', message: 'Invalid credentials' });
      }
  
      // Generate JWT token
      const token = user.generateAuthToken();
  
      res.status(200).json({ success: true, token });
    } catch (error) {
      next(error);
    }
  };

export { register, loginUser };
