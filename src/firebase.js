import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyA0wjUH8hB1VfqasPFqON2xBpr_uhWRMpA",
  authDomain: "pdcd-tracker.firebaseapp.com",
  projectId: "pdcd-tracker",
  storageBucket: "pdcd-tracker.firebasestorage.app",
  messagingSenderId: "724568460018",
  appId: "1:724568460018:web:a36100c090991bce6e1e6b"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
