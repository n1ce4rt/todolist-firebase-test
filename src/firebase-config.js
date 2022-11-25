// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';
import { getFirestore } from '@firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCjUhG4xP1jwd72DbbKlw1p7Z0kPk52gP4",
  authDomain: "todo-list-5c1cf.firebaseapp.com",
  projectId: "todo-list-5c1cf",
  storageBucket: "todo-list-5c1cf.appspot.com",
  messagingSenderId: "212422593809",
  appId: "1:212422593809:web:01ce6a4d31b81c85d950b0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app)
