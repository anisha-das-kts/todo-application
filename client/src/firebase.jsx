import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC2iSuqYVjsvXJmJWeoXHQI0L0csgB3jDU",
  authDomain: "my-todo-app-471125.firebaseapp.com",
  projectId: "my-todo-app-471125",
  storageBucket: "my-todo-app-471125.firebasestorage.app",
  messagingSenderId: "887806832762",
  appId: "1:887806832762:web:d5f05618a4e81beb330bc3",
  measurementId: "G-ZS85GY1QGN",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const provider = new GoogleAuthProvider();
