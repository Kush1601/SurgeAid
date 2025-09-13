
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB-apG3fufINpXOtnJpk-fVxvIFf-NnLTY",
  authDomain: "surgeaid.firebaseapp.com",
  projectId: "surgeaid",
  storageBucket: "surgeaid.firebasestorage.app",
  messagingSenderId: "63161911292",
  appId: "1:63161911292:web:3ff65696df9ff1ccba5479"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);