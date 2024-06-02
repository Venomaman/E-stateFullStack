import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';

export const signup = async (req, res, next) => {
  // console.log(req.body);
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are required.' });
  }
  const hashedPass = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password:hashedPass});
  try {
    await newUser.save()
    res.status(201).json('User created successfully!')
  } catch (error) {
     next(error);
  }

};
