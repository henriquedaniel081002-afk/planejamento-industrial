import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBDs0jTJZUnYQVHUILDxMAUJxqIgYEj6g8",
  authDomain: "planejamento-industrial-8d5bf.firebaseapp.com",
  projectId: "planejamento-industrial-8d5bf",
  storageBucket: "planejamento-industrial-8d5bf.firebasestorage.app",
  messagingSenderId: "889772228544",
  appId: "1:889772228544:web:34b3d854f4160fbe47d225"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
