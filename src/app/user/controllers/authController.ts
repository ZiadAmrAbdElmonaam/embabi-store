import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { generateToken } from '../helpers/tokenHelper';
import { signUpSchema, signInSchema } from '../validations/authValidation';
import User from '../models/User';

// Sign-Up Controller
export const signUp = async (req: Request, res: Response) => {
  // Validate the request body
  const { error } = signUpSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
      role: role || 'user',
    });

    await user.save();
    const token = generateToken(user._id.toString(), user.role);
    res.status(201).json({ message: 'User created', token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error creating user' });
  }
};

// Sign-In Controller
export const signIn = async (req: Request, res: Response) => {
  // Validate the request body
  const { error } = signInSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = generateToken(user._id.toString(), user.role);
    res.status(200).json({ message: 'Signed in successfully', token });
  } catch (err) {
    res.status(500).json({ error: 'Error signing in' });
  }
};

export const signOut = (req: Request, res: Response) => {
  res.status(200).json({ message: 'Signed out successfully' });
};