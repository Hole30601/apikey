import { firebaseConfig } from "./firebase-config.js";

import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    getDatabase,
    ref,
    set,
    get
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getDatabase(app);

function randomKey(len = 12) {

    const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZ123456789";

    let out = "";

    for(let i = 0; i < len; i++) {
        out += chars[
            Math.floor(Math.random() * chars.length)
        ];
    }

    return out;
}

document
.getElementById("loginBtn")
.addEventListener("click", async () => {

    const email =
    document.getElementById("email").value;

    const password =
    document.getElementById("password").value;

    try {

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

    } catch(err) {

        alert(err.message);

    }

});

onAuthStateChanged(auth, user => {

    if(!user) return;

    document.getElementById("loginBox")
    .style.display = "none";

    document.getElementById("panel")
    .style.display = "block";

    loadKeys();

});

document
.getElementById("createBtn")
.addEventListener("click", createKey);

async function createKey() {

    let key =
    document.getElementById("customKey")
    .value
    .trim()
    .toUpperCase();

    if(!key) {
        key = randomKey();
    }

    const type =
    document.getElementById("type").value;

    await set(ref(db, "keys/" + key), {
        active: true,
        is_locked: false,
        type,
        device_id: "",
        activated_at: 0,
        wrong_attempts: 0
    });

    document.getElementById("result")
    .innerText = "Đã tạo: " + key;

    loadKeys();
}

async function loadKeys() {

    const snapshot =
    await get(ref(db, "keys"));

    const list =
    document.getElementById("list");

    list.innerHTML = "";

    if(!snapshot.exists()) return;

    const data = snapshot.val();

    Object.keys(data).forEach(key => {

        const div =
        document.createElement("div");

        div.className = "key-item";

        div.innerHTML =
        `<b>${key}</b><br>${data[key].type}`;

        list.appendChild(div);

    });

}
