// Your web app's Firebase configuration (Medify project)
// For local dev: add 127.0.0.1 and localhost in Firebase Console → Authentication → Settings → Authorized domains
const firebaseConfig = {
    apiKey: "AIzaSyDxcGc3Uh2EAjV3C1gnNurzfcYgEaquIfY",
    authDomain: "medify-785e6.firebaseapp.com",
    projectId: "medify-785e6",
    storageBucket: "medify-785e6.firebasestorage.app",
    messagingSenderId: "82727222891",
    appId: "1:82727222891:web:abc7be5786328a1c54bb2e"
};

// Initialize Firebase (requires Firebase SDK scripts to be loaded first)
// Default app = customer (main site, checkout, notifications).
// Separate named apps per staff role so each role can stay logged in independently
// (e.g. pharmacist login should not override doctor login).
if (typeof firebase !== 'undefined') {
    window.firebaseApp = firebase.initializeApp(firebaseConfig);
    window.firebaseAuth = firebase.auth();
    window.firebaseDb = firebase.firestore();
    if (firebase.storage) {
        window.firebaseStorage = firebase.storage();
    }

    function initNamedApp(name) {
        try {
            return firebase.initializeApp(firebaseConfig, name);
        } catch (e) {
            if (e && e.code === 'app/duplicate-app') return firebase.app(name);
            throw e;
        }
    }

    // Staff role apps
    window.firebaseDoctorApp = initNamedApp('doctor');
    window.firebaseDoctorAuth = window.firebaseDoctorApp.auth();
    window.firebaseDoctorDb = window.firebaseDoctorApp.firestore();

    window.firebasePharmacistApp = initNamedApp('pharmacist');
    window.firebasePharmacistAuth = window.firebasePharmacistApp.auth();
    window.firebasePharmacistDb = window.firebasePharmacistApp.firestore();

    window.firebaseDeliveryApp = initNamedApp('delivery');
    window.firebaseDeliveryAuth = window.firebaseDeliveryApp.auth();
    window.firebaseDeliveryDb = window.firebaseDeliveryApp.firestore();

    window.firebaseClinicApp = initNamedApp('clinic');
    window.firebaseClinicAuth = window.firebaseClinicApp.auth();
    window.firebaseClinicDb = window.firebaseClinicApp.firestore();
} else {
    console.warn('Firebase SDK not loaded. Add Firebase script tags before firebase-config.js');
}
