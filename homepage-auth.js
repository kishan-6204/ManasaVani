import { auth } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

const authModal = document.getElementById("authModal");
const closeAuthModal = document.getElementById("closeAuthModal");
const headerLoginBtn = document.getElementById("headerLoginBtn");
const headerSignupBtn = document.getElementById("headerSignupBtn");
const heroLoginBtn = document.getElementById("heroLoginBtn");
const heroSignupBtn = document.getElementById("heroSignupBtn");
const authActions = document.getElementById("authActions");
const heroActions = document.getElementById("heroActions");
const authStateCopy = document.getElementById("authStateCopy");

function openModal(mode = "signin") {
    if (!authModal) return;
    authModal.classList.add("open");
    authModal.setAttribute("aria-hidden", "false");
    const showSignUp = mode === "signup";
    const signUpPanel = document.getElementById("signup");
    const signInPanel = document.getElementById("signIn");
    if (signUpPanel && signInPanel) {
        signUpPanel.style.display = showSignUp ? "block" : "none";
        signInPanel.style.display = showSignUp ? "none" : "block";
    }
}

function closeModal() {
    if (!authModal) return;
    authModal.classList.remove("open");
    authModal.setAttribute("aria-hidden", "true");
}

function renderGuestUI() {
    authActions.innerHTML = `
        <button class="secondary-btn" id="headerLoginBtn" type="button">Login</button>
        <button class="primary-btn" id="headerSignupBtn" type="button">Sign Up</button>
    `;
    heroActions.innerHTML = `
        <button class="primary-btn" id="heroLoginBtn" type="button">Login to continue</button>
        <button class="secondary-btn" id="heroSignupBtn" type="button">Create account</button>
    `;
    authStateCopy.textContent = "Guest mode: explore the experience, then sign in to start chatting.";
    bindAuthButtons();
}

function renderLoggedInUI() {
    authActions.innerHTML = `
        <button class="secondary-btn" id="continueChatBtn" type="button">Continue chatting</button>
        <button class="primary-btn" id="logoutBtn" type="button">Logout</button>
    `;
    heroActions.innerHTML = `
        <button class="primary-btn" id="heroContinueChatBtn" type="button">Continue chatting</button>
    `;
    authStateCopy.textContent = "You're signed in. Your companion chat is fully enabled.";

    document.getElementById("logoutBtn")?.addEventListener("click", async () => {
        await signOut(auth);
    });

    document.getElementById("continueChatBtn")?.addEventListener("click", () => {
        document.getElementById("prompt")?.focus();
    });

    document.getElementById("heroContinueChatBtn")?.addEventListener("click", () => {
        document.getElementById("prompt")?.focus();
    });
}

function bindAuthButtons() {
    document.getElementById("headerLoginBtn")?.addEventListener("click", () => openModal("signin"));
    document.getElementById("heroLoginBtn")?.addEventListener("click", () => openModal("signin"));
    document.getElementById("headerSignupBtn")?.addEventListener("click", () => openModal("signup"));
    document.getElementById("heroSignupBtn")?.addEventListener("click", () => openModal("signup"));
}

closeAuthModal?.addEventListener("click", closeModal);
authModal?.addEventListener("click", (event) => {
    if (event.target === authModal) {
        closeModal();
    }
});

onAuthStateChanged(auth, (user) => {
    if (user) {
        closeModal();
        renderLoggedInUI();
    } else {
        renderGuestUI();
    }

    window.dispatchEvent(new CustomEvent("auth-state-changed", {
        detail: {
            isAuthenticated: !!user,
        },
    }));
});

bindAuthButtons();

window.openAuthModal = openModal;
window.closeAuthModal = closeModal;
