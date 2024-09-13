// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCM2Omf9BZdVuqOVWWuxlEYg2EZuExUix4",
    authDomain: "chatroom-85f4d.firebaseapp.com",
    projectId: "chatroom-85f4d",
    storageBucket: "chatroom-85f4d.appspot.com",
    messagingSenderId: "815795842293",
    appId: "1:815795842293:web:3c6228a544f97c247d69bc",
    measurementId: "G-NXKQ550NPY"
  };
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Auth and Firestore
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
// const analytics = getAnalytics(firebaseApp);
export { auth, db };