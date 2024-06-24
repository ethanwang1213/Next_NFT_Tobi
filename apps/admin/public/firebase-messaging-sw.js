// public/firebase-messaging-sw.js
importScripts(
  "https://www.gstatic.com/firebasejs/10.11.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyALE9B9ErxN6KjL8_aaW6Nj4w5L_kNtFjo",
  authDomain: "tobiratory-f6ae1.firebaseapp.com",
  projectId: "tobiratory-f6ae1",
  storageBucket: "tobiratory-f6ae1.appspot.com",
  messagingSenderId: "578163240854",
  appId: "1:578163240854:web:6f7298d0cbc69921a177b7",
  measurementId: "G-CSVP2WR95Y",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  if (Notification.permission === "granted") {
    if (navigator.serviceWorker)
      navigator.serviceWorker.getRegistration().then(async function (reg) {
        if (reg)
          await reg.showNotification(payload.notification.title, {
            body: payload.notification.body,
          });
      });
  }
});
