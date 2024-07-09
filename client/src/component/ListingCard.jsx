import React from "react";
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

export default function ListingCard({ listing }) {
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={listing.imageUrls[0] || "https://images.pexels.com/photos/4061974/pexels-photo-4061974.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"}
          alt="image listing hover"
          className="h-[320px] sm:h-[200px] w-full object-cover hover:scale-105 transition-scale duration-300"
        />
        <div className="p-3 flex flex-col gap-2 w-full">
          <p className="truncate text-xl font-semibold text-slate-600 mt-3">
            {listing.name}
          </p>
          <div className="flex items-center gap-1">
            <MdLocationOn className="h-4 w-4 text-green-600 items-center" />
            <p className="text-sm text-gray-500 truncate w-full items-center">
              {listing.address}
            </p>
          </div>
          <p className="text-sm text-gray-700 line-clamp-2">
            {listing.description}
          </p>
          <p className="text-slate-600 font-semibold mt-2">
            Rs:{" "}
            {listing.offer
              ? listing.discountPrice.toLocaleString("en-US")
              : listing.regularPrice.toLocaleString("en-US")}
            {"/-"}
            {listing.type === "rent" && " month"}
          </p>
          <div className="flex gap-4 text-slate-500">
            <div className="text-xs font-medium">
              {listing.bedrooms > 1
                ? `${listing.bedrooms} beds`
                : `${listing.bedrooms} bed`}
            </div>
            <div className="text-xs font-medium">
              {listing.bathrooms > 1
                ? `${listing.bathrooms} baths`
                : `${listing.bathrooms} bath`}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
