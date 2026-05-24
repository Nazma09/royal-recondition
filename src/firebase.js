import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyBZ4bikOT7S9m04h2fBEJ_AgbPGe9AhAPA",
  authDomain: "royal-recondition.firebaseapp.com",
  projectId: "royal-recondition",
  storageBucket: "royal-recondition.firebasestorage.app",
  messagingSenderId: "89122405160",
  appId: "1:89122405160:web:0d4d4971557feececdee1d",
  measurementId: "G-1X5XHCRSNB"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
