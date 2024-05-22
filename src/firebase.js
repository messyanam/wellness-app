// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBAidHXZxkUJt6kA2-s2JBr5gTDUhVCcHc",
  authDomain: "wellness-app-66a1c.firebaseapp.com",
  projectId: "wellness-app-66a1c",
  storageBucket: "wellness-app-66a1c.appspot.com",
  messagingSenderId: "990270787732",
  appId: "1:990270787732:web:00ecb8c8af0216fd14a481"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
