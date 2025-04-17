import { initializeApp } from "firebase/app";

const firebaseConfig = {
  // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD5BN31YeUMWKXaE8cIOiJuTeUua3M5xek",
  authDomain: "marketplaceanalytics-7168e.firebaseapp.com",
  projectId: "marketplaceanalytics-7168e",
  storageBucket: "marketplaceanalytics-7168e.firebasestorage.app",
  messagingSenderId: "328309444157",
  appId: "1:328309444157:web:fe74d280fb5eff31942454",
  measurementId: "G-G7QGX0H8EL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
};

const app = initializeApp(firebaseConfig);
export default app;