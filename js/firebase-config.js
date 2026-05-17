import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, RecaptchaVerifier, signInWithPopup, signInWithPhoneNumber, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// TODO: Replace this with your own Firebase Project Configuration!
// 1. Go to console.firebase.google.com
// 2. Add a new web app
// 3. Copy the firebaseConfig object here:
const firebaseConfig = {
  apiKey: "AIzaSyAw6dThTcXb2GlQns9OpTH3U3yZOpzPGH8",
  authDomain: "cresthive-consultancy.firebaseapp.com",
  projectId: "cresthive-consultancy",
  storageBucket: "cresthive-consultancy.firebasestorage.app",
  messagingSenderId: "1006932684203",
  appId: "1:1006932684203:web:6e119fb0520c91237c76ee",
  measurementId: "G-SZGJ1CYZBW"
};

let app, auth, db;
try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("Firebase modules loaded.");
} catch(e) {
    console.error("Firebase Initialization Error. Have you added your config?", e);
}

export { auth, db, GoogleAuthProvider, RecaptchaVerifier, signInWithPopup, signInWithPhoneNumber, onAuthStateChanged, signOut, collection, addDoc, getDocs, query, orderBy, serverTimestamp };
