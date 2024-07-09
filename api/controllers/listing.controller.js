import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListings = async (req, res, next) => {
  const listings = await Listing.findById(req.params.id);
  if (!listings) {
    return next(errorHandler(404, "Listings not found.."));
  }
  if (req.user.id !== listings.userRef) {
    return next(errorHandler(401, "you can only delete your own listings!"));
  }
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing has been deleted!");
  } catch (error) {
    next(error);
  }
};

export const updateListings = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, "Listings not found..."));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "you can update only your OWN content!.."));
  }
  try {
    const updatedListings = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListings);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(403, "listing not found..."));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getAllListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    let offer = req.query.offer;

    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;
    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;
    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent"] };
    }

    const searchTerm = req.query.searchTerm || "";
    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";

    const allListing = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(allListing);
  } catch (error) {
    next(error);
  }
};
