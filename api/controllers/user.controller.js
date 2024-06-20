import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const test = (req, res) => {
  res.json({
    msg: "Api route is Working!",
  });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "you can update only your account!"));
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          //using set because user sometime want to update/change one data or multiple data so it will ignore other/rest data..
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    ); //it will set the new information/ else u will get the old information..

    const { password, ...rest } = updateUser._doc;
    res.status(200).json(rest);
  } catch (error) {}
};

export const deleteUser = async(req, res, next)=>{
  if(req.user.id !== req.params.id) return next(errorHandler(401, 'you can only delete on your account'))
    try {
      await User.findByIdAndDelete(req.params.id);
      res.clearCookie('access_token');
      res.status(200).json('user has been deleted!');
    } catch (error) {
      next(error);
    }

};

export const getUserListing = async(req, res, next) => {
  if(req.user.id !== req.params.id){
    return next(errorHandler(401, 'u can only view your own listings!..'))
  }
  try {
    const listings = await Listing.find({userRef: req.params.id});
    res.status(200).json(listings);
  } catch (error) {
    next(error)
  }
}
