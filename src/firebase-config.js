// Import the functions you need from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";   // For Firebase Authentication
import { getFirestore } from "firebase/firestore";  // For Firestore (database)
// Optionally, you can import Analytics if you plan to use it
// import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAWM2UiQMIGJUX0r7iULsSZ-UCxaK_YmKY",
  authDomain: "personal-finance-app-2d328.firebaseapp.com",
  projectId: "personal-finance-app-2d328",
  storageBucket: "personal-finance-app-2d328.appspot.com",
  messagingSenderId: "455906612173",
  appId: "1:455906612173:web:cd5801a8c448c7d2926a84",
  measurementId: "G-C21C9QW54D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);  // This is for Firebase Authentication
const db = getFirestore(app);  // This is for Firestore database

// Optionally, initialize Analytics if you plan to use it
// const analytics = getAnalytics(app);

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();

export { auth,db, googleProvider }; // Export these services to use them in your app

//export { auth, db };  
