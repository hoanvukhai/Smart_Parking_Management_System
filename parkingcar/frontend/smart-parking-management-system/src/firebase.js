import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD5PG3Emv-PsLNAgriFa-qCCHt1DmxBJ0o",
  authDomain: "smartparkingmanagementsy-42ed2.firebaseapp.com",
  databaseURL: "https://smartparkingmanagementsy-42ed2-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "smartparkingmanagementsy-42ed2",
  storageBucket: "smartparkingmanagementsy-42ed2.appspot.com",
  messagingSenderId: "44904333133",
  appId: "1:44904333133:web:9295ac9c7ea362c249c104",
  measurementId: "G-5JYBTG1H6L"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app)
const provider = new GoogleAuthProvider();
const db = getFirestore(app)

export { database, ref, onValue, auth, provider, signInWithPopup, db };