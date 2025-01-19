import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDOCAbC50k85O-kMm2azFCJYNYMvtmBMgM",
  authDomain: "hatim-takip.firebaseapp.com",
  projectId: "hatim-takip",
  storageBucket: "hatim-takip.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdefghijklmnop"
};

// Firebase'i başlatma
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase, auth, firestore };
