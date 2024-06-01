import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';

export const signup = async (req, res) => {
  // console.log(req.body);
  const { username, email, password } = req.body;
  const hashedPass = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password:hashedPass});
  try {
    await newUser.save()
    res.status(201).json({
      msg:'user created successfully!'
    })
  } catch (error) {
    res.status(500).json({
        msg:'username and email must be unique',
        error
    });
  }

};
