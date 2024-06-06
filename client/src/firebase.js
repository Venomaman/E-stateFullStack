// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-607f6.firebaseapp.com",
  projectId: "mern-estate-607f6",
  storageBucket: "mern-estate-607f6.appspot.com",
  messagingSenderId: "578176365686",
  appId: "1:578176365686:web:a4a3b95e47747bf4aedb57"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);