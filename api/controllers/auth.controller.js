import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  // console.log(req.body);
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ error: "Username, email, and password are required." });
  }
  const hashedPass = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPass });
  try {
    await newUser.save();
    res.status(201).json("User created successfully!");
  } catch (error) {
    next(error);
  }
};

//signin api logic....

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      error: "email and password required!",
    });
  }
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "user not found!"));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "wrong creds!"));
    //jwt token logic...
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET_KEY);
    //we donot want user password to return....
    const { password: pass, ...userInfoWithoutPass } = validUser._doc;
    //store cookie in side browser..
    res
      .cookie("access_token", token, { httpOnly: true }) //can add epires time also like--> expires: new Date(Date.now() + 24 *60*60*1000)
      .status(200)
      .json(userInfoWithoutPass);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const generatePassword = Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatePassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-8), //logic to convert in unique username with some random number..
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {}
};

export const signout =async(req, res, next)=>{
  try {
    res.clearCookie("access_token");
    res.status(200).json("you have been Logged-out successfully!")
  } catch (error) {
    next(error)
  }

}
