// signup.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup
} from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB_x1uvBqjrZXXz63K2JzwjuRilFpKAAys",
  authDomain: "sd-project-4e3f9.firebaseapp.com",
  projectId: "sd-project-4e3f9",
  storageBucket: "sd-project-4e3f9.appspot.com",
  messagingSenderId: "120329407460",
  appId: "1:120329407460:web:d755d1b7a34597908155f1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Sign in with Google
function signInWithGoogle() {
  console.log("Starting sign in with Google.");
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then(result => {
      // Extract user data and token from Google response.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      const uid = user.uid;

      // Get the selected role from the dropdown.
      const role = document.getElementById("role").value;
      if (!role) {
        alert("Please select a role before continuing.");
        return;
      }

      alert("Signed in with Google!");

      // Send UID and role to the backend.
      fetch('https://backend-k52m.onrender.com/users', {
        method: 'POST',
        mode: 'cors', // Explicitly set CORS mode.
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ uid, role })
      })
        .then(async res => {
          console.log("Response received from server:", res);
          // Check if response is JSON.
          const contentType = res.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            return res.json();
          } else {
            const text = await res.text();
            throw new Error('Server returned non-JSON response: ' + text);
          }
        })
        .then(data => {
          if (data.success) {
            alert("User added to the database successfully!");
          } else {
            alert("Error saving user: " + (data.error || "Unknown error"));
          }
        })
        .catch(err => {
          console.error("Fetch error:", err);
          alert("Network error: " + err.message);
        });
    })
    .catch(error => {
      // Captures errors from signInWithPopup.
      alert(error.message);
    });
}

// Expose the signInWithGoogle function to the global window object so that the HTML button can access it.
window.signInWithGoogle = signInWithGoogle;
