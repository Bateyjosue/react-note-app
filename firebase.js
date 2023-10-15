import { initializeApp } from "firebase/app";
import {getFirestore, collection } from "firebase/firestore"
const firebaseConfig = {
  apiKey: "AIzaSyCH319vBBYe-KMjxHPLQrivKDb41EQzU9c",
  authDomain: "note-app-1f5f8.firebaseapp.com",
  projectId: "note-app-1f5f8",
  storageBucket: "note-app-1f5f8.appspot.com",
  messagingSenderId: "231775327648",
  appId: "1:231775327648:web:a0733813b50a4a80eb40c5"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const notesCollection = collection(db, 'notes')