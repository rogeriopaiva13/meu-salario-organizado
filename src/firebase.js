import { initializeApp } from "firebase/app";

import {
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";

import {
  getFirestore,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAVPsaa7ZZpwJpprLLwAGJhM8Bb8pId_SQ",
  authDomain: "meu-salario-organizado.firebaseapp.com",
  projectId: "meu-salario-organizado",
  storageBucket: "meu-salario-organizado.firebasestorage.app",
  messagingSenderId: "421726461241",
  appId: "1:421726461241:web:e15494e468671538cb9ce8",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const provider = new GoogleAuthProvider();

export const db = getFirestore(app);
