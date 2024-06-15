// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export function firebaseSetup() {
  
  const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_KEY,
    authDomain: "verbose-debates.firebaseapp.com",
    projectId: "verbose-debates",
    storageBucket: "verbose-debates.appspot.com",
    messagingSenderId: "1048499980348",
    appId: "1:1048499980348:web:7557eefb07bb06373b5b39"
  };

  initializeApp(firebaseConfig);
};