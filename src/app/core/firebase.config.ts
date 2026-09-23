import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyBypngLFr33w6WjqPPLGCmS2BbFg__w2Dw",
    authDomain: "deskforge-e7e96.firebaseapp.com",
    projectId: "deskforge-e7e96",
    storageBucket: "deskforge-e7e96.firebasestorage.app",
    messagingSenderId: "631305781875",
    appId: "1:631305781875:web:93555fa0d4585e70bfe006",
    measurementId: "G-CRQDNGNJQ1"
};

export const firebaseApp =
    initializeApp(firebaseConfig);