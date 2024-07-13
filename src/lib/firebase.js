// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyBa09eITaTprxixgfdwRxE1jZnMnDU5Pu8",
    authDomain: "react-chatapp-7e680.firebaseapp.com",
    projectId: "react-chatapp-7e680",
    storageBucket: "react-chatapp-7e680.appspot.com",
    messagingSenderId: "1013824051780",
    appId: "1:1013824051780:web:b0e087940706290f443a11",
    measurementId: "G-H9JSWPPL7R"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
