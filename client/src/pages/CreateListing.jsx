import React, { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

function CreateListing() {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
  });

  const [imgUploadError, setImgUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);

  console.log(formData);
  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImgUploadError(false);
      const promises = []; //we use promises becz we have 6 number of images and uploading async so they uploading one by one they have to wait for one to finish uploading.

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImgUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImgUploadError("Image upload failed (2mb) max size req !");
          setUploading(false);
        });
    } else {
      setImgUploadError(
        "you can upload more then 0 and only 6 images as per listings..."
      );
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`uplaod in ${progress} % done..`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleImageDelete = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing....
      </h1>
      <form className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1 p-4">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            minLength={10}
            maxLength={62}
            required
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="desc"
            required
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="Address"
            required
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-5" />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-5" />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-5" />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-5" />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-5" />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min={1}
                max={10}
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <span>Bedrooms</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min={1}
                max={10}
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <span>Bathrooms</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min={1}
                max={10}
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <div className="flex flex-col items-center">
                <span>Regular price</span>
                <span className="text-xs">(Rs. / month)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="discountPrice"
                min={1}
                max={10}
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <div className="flex flex-col items-center">
                <span>Discounted price</span>
                <span className="text-xs">(Rs. / month)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4 ml-0">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-slate-500 ml-2">
              The first image will be cover (max-6) images.
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => {
                setFiles(e.target.files);
              }}
              className="p-3 border border-slate-300 rounded-lg w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              disabled={uploading}
              onClick={handleImageSubmit}
              type="button"
              className="p-3  border border-green-600 rounded-lg hover:shadow-lg disabled:opacity-80 uppercase"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <p className="p-3 text-red-800">{imgUploadError && imgUploadError}</p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className="flex justify-between p-3 border border-slate-300 items-center"
              >
                <img
                  src={url}
                  alt="listing image"
                  className="size-40 object-contain rounded-lg"
                />
                <button
                  onClick={() => handleImageDelete(index)}
                  type="button"
                  className="text-red-700 p-3 rounded-lg uppercase hover:shadow-xl border border-slate-400"
                >
                  Delete
                </button>
              </div>
            ))}
          <button className="p-3 bg-slate-700 text-white rounded-lg hover:opacity-80 disabled:opacity-70 mt-3">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}

export default CreateListing;
