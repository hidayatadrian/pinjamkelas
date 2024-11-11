// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // Impor getAuth
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
apiKey: "AIzaSyCm3z3InxFbYXmPzOshpVpIpl82FLsHJWE",
authDomain: "pinjamkelas-1e68e.firebaseapp.com",
projectId: "pinjamkelas-1e68e",
storageBucket: "pinjamkelas-1e68e.firebasestorage.app",
messagingSenderId: "113759810348",
appId: "1:113759810348:web:8a7c0f82d369677822b289",
measurementId: "G-QC79HZV9YJ"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);


export {app, analytics, auth, provider, db}