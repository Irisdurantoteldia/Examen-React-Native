// Firebase/FirebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// La configuració de la teva app Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDMyRVwJIaNDOPS1azZfje0h8akRZXyjOg",
  authDomain: "examenreactnative.firebaseapp.com",
  projectId: "examenreactnative",
  storageBucket: "examenreactnative.firebasestorage.app",
  messagingSenderId: "1009038680734",
  appId: "1:1009038680734:web:16577e374f758d4a56d18f"
};

// Inicialitza Firebase
const app = initializeApp(firebaseConfig);

// Inicialitza Firestore
const db = getFirestore(app);

export { db };
