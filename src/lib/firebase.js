// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getMessaging, getToken } from "firebase/messaging";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCaULeM38NXUkrvfJzH0SqVMFTRKjzvTkM",
  authDomain: "tourease-544c3.firebaseapp.com",
  databaseURL: "https://tourease-544c3-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tourease-544c3",
  storageBucket: "tourease-544c3.firebasestorage.app",
  messagingSenderId: "442077525561",
  appId: "1:442077525561:web:e4beb77af00fa45a16bfe8",
  measurementId: "G-6TS100MM1D"
};



const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);


export { app,auth, database };