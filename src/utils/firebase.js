import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

//Configuration for account(google console)
const firebaseConfig = {
  apiKey: "AIzaSyDDTKC5TtiedENkKwbf7sOA2WQGySbFc9Q",
  authDomain: "csia-ad3e5.firebaseapp.com",
  projectId: "csia-ad3e5",
  storageBucket: "csia-ad3e5.appspot.com",
  messagingSenderId: "1002939455483",
  appId: "1:1002939455483:web:42397aecc3e3a5bc6f1d5e",
  measurementId: "G-6KCRS27BX5",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
