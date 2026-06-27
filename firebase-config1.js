/* ===========================================================
   দ্বীনপথ — Firebase কনফিগারেশন ও অথ হেল্পার
   প্রজেক্ট: deenpath-4e575
   =========================================================== */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics, isSupported as analyticsSupported } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCUGGjzpztFkuEHCjvzG57pfpn3l7dAbbQ",
  authDomain: "deenpath-4e575.firebaseapp.com",
  projectId: "deenpath-4e575",
  storageBucket: "deenpath-4e575.firebasestorage.app",
  messagingSenderId: "705166709821",
  appId: "1:705166709821:web:fb4d7e50ea0248ff774654",
  measurementId: "G-65TDNLYX4Q",
};

const fbApp = initializeApp(firebaseConfig);

// Analytics শুধু সাপোর্টেড ব্রাউজার এনভায়রনমেন্টে লোড হবে (যেমন, ফাইল:// বা কিছু প্রাইভেট মোডে এটা ফেল করতে পারে)
analyticsSupported().then((ok) => { if (ok) getAnalytics(fbApp); }).catch(() => {});

const auth = getAuth(fbApp);
const db = getFirestore(fbApp);
const googleProvider = new GoogleAuthProvider();

/* ---------- গুগল সাইন-ইন ---------- */
async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    // ব্যবহারকারীর প্রোফাইল Firestore-এ আপসার্ট করা
    await setDoc(
      doc(db, "users", user.uid),
      {
        name: user.displayName || "",
        email: user.email || "",
        photoURL: user.photoURL || "",
        lastLogin: serverTimestamp(),
      },
      { merge: true }
    );
    return user;
  } catch (err) {
    console.error("Google sign-in error:", err);
    throw err;
  }
}

async function signOutUser() {
  return signOut(auth);
}

/* ---------- হেডার UI আপডেট (সব পেজে কমন) ---------- */
function renderAuthUI(user) {
  const slot = document.getElementById("authSlot");
  if (!slot) {
    // common.js এখনো হেডার রেন্ডার করেনি — DOM রেডি হওয়ার পর আবার চেষ্টা করা
    document.addEventListener("DOMContentLoaded", () => renderAuthUI(user), { once: true });
    return;
  }

  if (user) {
    const photo = user.photoURL || "";
    const initial = (user.displayName || user.email || "ব").charAt(0);
    slot.innerHTML = `
      <div class="auth-user" id="authUserToggle">
        ${photo ? `<img src="${photo}" alt="" class="auth-avatar">` : `<span class="auth-avatar auth-avatar-fallback">${initial}</span>`}
        <span class="auth-name">${(user.displayName || "ব্যবহারকারী").split(" ")[0]}</span>
      </div>
      <div class="auth-dropdown" id="authDropdown">
        <div class="auth-dropdown-head">
          <div class="auth-dropdown-name">${user.displayName || "ব্যবহারকারী"}</div>
          <div class="auth-dropdown-email">${user.email || ""}</div>
        </div>
        <button class="auth-dropdown-item" id="signOutBtn">লগ-আউট করুন</button>
      </div>
    `;
    document.getElementById("authUserToggle").addEventListener("click", () => {
      document.getElementById("authDropdown").classList.toggle("open");
    });
    document.getElementById("signOutBtn").addEventListener("click", async () => {
      await signOutUser();
      if (typeof showToast === "function") showToast("লগ-আউট হয়েছে");
    });
  } else {
    slot.innerHTML = `<button class="btn btn-outline btn-sm" id="googleSignInBtn">
      <svg width="16" height="16" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.92A8.78 8.78 0 0 0 17.64 9.2z"/><path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.97 10.72A5.41 5.41 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.96A8.98 8.98 0 0 0 0 9c0 1.45.35 2.83.96 4.05l3.01-2.33z"/><path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A8.93 8.93 0 0 0 9 0 9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"/></svg>
      গুগল দিয়ে লগইন
    </button>`;
    document.getElementById("googleSignInBtn").addEventListener("click", async () => {
      try {
        await signInWithGoogle();
        if (typeof showToast === "function") showToast("সফলভাবে লগইন হয়েছে");
      } catch (err) {
        if (typeof showToast === "function") showToast("লগইন ব্যর্থ হয়েছে, আবার চেষ্টা করুন");
      }
    });
  }
}

document.addEventListener("click", (e) => {
  const dropdown = document.getElementById("authDropdown");
  const toggle = document.getElementById("authUserToggle");
  if (dropdown && toggle && !toggle.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.classList.remove("open");
  }
});

onAuthStateChanged(auth, (user) => {
  renderAuthUI(user);
  window.dispatchEvent(new CustomEvent("deenpath-auth-changed", { detail: { user } }));
});

// গ্লোবালভাবে এক্সপোজ করা (non-module স্ক্রিপ্ট থেকে অ্যাক্সেসের জন্য)
window.DeenpathAuth = { auth, db, signInWithGoogle, signOutUser };
