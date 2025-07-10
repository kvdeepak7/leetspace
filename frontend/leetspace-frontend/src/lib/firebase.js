// src/lib/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBnKIwRsTYWX9Acc66dKGEuSRaPCfM2MNU",
    authDomain: "leetspaceauth.firebaseapp.com",
    projectId: "leetspaceauth",
    storageBucket: "leetspaceauth.firebasestorage.app",
    messagingSenderId: "11940892272",
    appId: "1:11940892272:web:d4f1742db569b474166eb5",
    measurementId: "G-VNVMM0N5K5"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);