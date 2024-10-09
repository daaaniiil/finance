import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
    apiKey: 'AIzaSyBEfKVA69d6fc43qZs7y6S-71GRePCuvGo',
    authDomain: 'finance-app-f9e49.firebaseapp.com',
    projectId: 'finance-app-f9e49',
    storageBucket: 'finance-app-f9e49.appspot.com',
    messagingSenderId: '803686536118',
    appId: '1:803686536118:web:8fc7c555602c73c7d0e717'
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db  = getFirestore(app)