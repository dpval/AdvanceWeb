import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDxtVB-hXobABJya99o7AlNEG3PHOKuENU",
    authDomain: "advanceweb-f3f57.firebaseapp.com",
    projectId: "advanceweb-f3f57",
    storageBucket: "advanceweb-f3f57.appspot.com",
    messagingSenderId: "874297525537",
    appId: "1:874297525537:web:b07985f9844f022190ea60",
    measurementId: "G-NGQS6GKEQT"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const fs = getFirestore(app);
const storage = getStorage(app);
const db = getFirestore(app);

export { db };

export { auth, fs, storage }

