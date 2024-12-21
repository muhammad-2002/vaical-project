// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAt7ZJdiR1xtdGRgkZSgmDDmfqZ7_k6pIc",
  authDomain: "vaicals-project.firebaseapp.com",
  projectId: "vaicals-project",
  storageBucket: "vaicals-project.firebasestorage.app",
  messagingSenderId: "1092117047237",
  appId: "1:1092117047237:web:ce48791836a22415978dac",
  measurementId: "G-K3D185143Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
export default auth;