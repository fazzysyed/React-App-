import firebase from "firebase";
const firebaseConfig = {
  apiKey: "AIzaSyCEu6-S9Xbd2yjx9HwEIiKw08YOTyUEqNA",
  authDomain: "door-bell-7cd61.firebaseapp.com",
  projectId: "door-bell-7cd61",
  storageBucket: "door-bell-7cd61.appspot.com",
  messagingSenderId: "781618282766",
  appId: "1:781618282766:web:5ee11fa359ed3bf905175f",
};

const app = firebase.initializeApp(firebaseConfig);

export const db = app.firestore();
// export const messaging = app.messaging();
