import react, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { app } from "../firebase";
import { Link } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutFailure,
  signInStart,
  signOutStart,
  signOutSuccess,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filepercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccessMsg, setUpdateSuccessMsg] = useState(false);
  const [showListingError, setShowListingError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();
  // console.log(filepercentage);
  // console.log(formData);

  //   change your firebase storage rules: ->

  //   allow read;
  //   allow write: if
  //   request.resource.size < 2 * 1024 * 1024 &&
  //   request.resource.contentType.matches('image/.*')

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercentage(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccessMsg(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      dispatch(signOutStart());
      const res = await fetch(`api/auth/signout`);
      const data = await res.json;
      if (data.success === false) {
        dispatch(signOutFailure(data.message));
        return;
      }
      dispatch(signOutSuccess(data));
    } catch (error) {
      dispatch(signOutFailure(error.message));
    }
  };

  const handleShowListing = async () => {
    try {
      setShowListingError(false);
      const res = await fetch(`api/user/listings/${currentUser._id}`);
      const data = await res.json();
      console.log("Fetched Listings:", data); // Log the fetched data
      if (data.success === false) {
        setShowListingError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingError(true);
    }
  };

  const handleDeleteListing = async (listingId) => {
    try {
      const res = await fetch(`api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUserListings((prev) => {
        const updatedListings = prev.filter(
          (listing) => listing._id !== listingId
        );
        console.log("Updated Listings:", updatedListings); // Log the updated listings
        return updatedListings;
      });
    } catch (error) {
      console.error("Error deleting listing:", error.message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Profile</h1>
      <form on onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData?.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full size-24 object-cover cursor-pointer self-center"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span>Error while uploading image</span>
          ) : filepercentage > 0 && filepercentage < 100 ? (
            <span className="text-red-700">
              {`Uploading ${filepercentage} %.... `}
            </span>
          ) : filepercentage === 100 ? (
            <span className="text-gray-700">Successfully Uploaded!</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="username"
          id="username"
          defaultValue={currentUser.username}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          defaultValue={currentUser.email}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
        />
        <button
          disabled={loading}
          className="bg-slate-700 p-3 rounded-lg text-white hover:opacity-80"
        >
          {loading ? "loading..." : "Update"}
        </button>

        <Link
          className="bg-green-800 p-3 rounded-lg text-white text-center hover:opacity-80"
          to={"/create-listing"}
        >
          Create Listing
        </Link>
      </form>

      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-800 cursor-pointer"
        >
          Delete Account
        </span>
        <span onClick={handleSignout} className="text-red-600 cursor-pointer">
          Sign Out
        </span>
      </div>
      <p className="text-green-700">
        {updateSuccessMsg ? "user updated successfully !" : ""}
      </p>
      <div className="pt-3">
        <button
          onClick={handleShowListing}
          className="text-green-900 w-full border p-2 rounded-xl border-slate-500 hover:shadow-xl"
        >
          Show Listing
        </button>
        <p className="text-red-600">
          {showListingError ? "Error showing listing" : ""}
        </p>
        {userListings && userListings.length > 0 && (
          <div className="flex flex-col gap-4">
            <h1 className="text-center my-7 text-3xl font-semibold">
              Your Listings..
            </h1>
            {userListings.map((listing) => (
              <div
                key={listing._id}
                className="border-2 bg-slate-50 rounded-xl p-3 flex justify-between items-center gap-10"
              >
                <Link to={`/listing/${listing._id}`}>
                  <img
                    src={listing.imageUrls[0]}
                    alt="listing cover"
                    className="size-20 object-contain"
                  />
                </Link>
                <Link
                  className="text-slate-700 font-semibold flex-1 hover:underline truncate"
                  to={`/listing/${listing._id}`}
                >
                  <p>{listing.name}</p>
                </Link>
                <div className="items-center">
                  <button
                    onClick={() => handleDeleteListing(listing._id)}
                    className="text-red-600 uppercase border border-slate-500 p-2 rounded-xl hover:shadow-xl "
                  >
                    Delete
                  </button>
                  <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-600 uppercase border border-slate-500 p-2 rounded-xl hover:shadow-xl ml-2">
                    Edit
                  </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
