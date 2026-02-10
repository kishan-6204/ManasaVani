import { auth, db } from "./firebase-config.js";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { setDoc, doc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

function showMessage(message, divId) {
    const messageDiv = document.getElementById(divId);
    if (!messageDiv) return;

    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;

    setTimeout(() => {
        messageDiv.style.opacity = 0;
    }, 5000);
}

const signUp = document.getElementById("submitSignUp");
if (signUp) {
    signUp.addEventListener("click", (event) => {
        event.preventDefault();
        const email = document.getElementById("rEmail")?.value;
        const password = document.getElementById("rPassword")?.value;
        const firstName = document.getElementById("fName")?.value;
        const lastName = document.getElementById("lName")?.value;

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                const userData = { email, firstName, lastName };
                showMessage("Account created successfully", "signUpMessage");

                const docRef = doc(db, "users", user.uid);
                setDoc(docRef, userData)
                    .then(() => {
                        const authModal = document.getElementById("authModal");
                        if (authModal) {
                            window.closeAuthModal?.();
                        } else {
                            window.location.href = "index.html";
                        }
                    })
                    .catch((error) => {
                        console.error("Error writing document", error);
                    });
            })
            .catch((error) => {
                if (error.code === "auth/email-already-in-use") {
                    showMessage("Email address already exists", "signUpMessage");
                } else {
                    showMessage("Unable to create user", "signUpMessage");
                }
            });
    });
}

const signIn = document.getElementById("submitSignIn");
if (signIn) {
    signIn.addEventListener("click", (event) => {
        event.preventDefault();
        const email = document.getElementById("email")?.value;
        const password = document.getElementById("password")?.value;

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                showMessage("Login successful", "signInMessage");
                const user = userCredential.user;
                localStorage.setItem("loggedInUserId", user.uid);

                const authModal = document.getElementById("authModal");
                if (authModal) {
                    window.closeAuthModal?.();
                } else {
                    window.location.href = "index.html";
                }
            })
            .catch((error) => {
                if (error.code === "auth/invalid-credential") {
                    showMessage("Incorrect email or password", "signInMessage");
                } else {
                    showMessage("Account does not exist", "signInMessage");
                }
            });
    });
}

const googleButton = document.getElementById("googleSignInBtn");
if (googleButton) {
    googleButton.addEventListener("click", (event) => {
        event.preventDefault();
        const provider = new GoogleAuthProvider();

        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                showMessage("Google sign-in successful", "signInMessage");
                localStorage.setItem("loggedInUserId", user.uid);

                const authModal = document.getElementById("authModal");
                if (authModal) {
                    window.closeAuthModal?.();
                } else {
                    window.location.href = "index.html";
                }
            })
            .catch((error) => {
                showMessage(`Google sign-in error: ${error.message}`, "signInMessage");
            });
    });
}

const signUpButton = document.getElementById("signUpButton");
signUpButton?.addEventListener("click", (event) => {
    event.preventDefault();
    document.getElementById("signIn").style.display = "none";
    document.getElementById("signup").style.display = "block";
});

const signInButton = document.getElementById("signInButton");
signInButton?.addEventListener("click", (event) => {
    event.preventDefault();
    document.getElementById("signup").style.display = "none";
    document.getElementById("signIn").style.display = "block";
});

onAuthStateChanged(auth, (user) => {
    const inLegacyLoginPage = window.location.pathname.endsWith("login.html");
    if (inLegacyLoginPage && user) {
        window.location.href = "index.html";
    }
});
