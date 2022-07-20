let config = {
  apiKey: "AIzaSyDmgQKTA1sxF-BPCy6xS7gMpgeCRb-B51M",
  authDomain: "csss-33b79.firebaseapp.com",
  databaseURL: "https://csss-33b79.firebaseio.com",
  projectId: "csss-33b79",
  storageBucket: "csss-33b79.appspot.com",
  messagingSenderId: "955173911077"
};

firebase.initializeApp(config);
firebase.firestore().settings({timestampsInSnapshots: true});

const SELECTED_USER_ID = 'SELECTED_USER_ID';

const USER_LOGGED_OUT_CALLBACKS = [];
const ADMIN_USER_SELECTED_CALLBACKS = [];
const INDICATOR_CHANGE_CALLBACKS = [];

let removeFirebaseIndicatorListener = () => {
};

function addFirebaseIndicatorListener() {
  return new Promise((resolve, reject) => {
    removeFirebaseIndicatorListener = firebase.firestore()
      .collection("db").doc("v1")
      .collection("users").doc(sessionStorage.getItem(SELECTED_USER_ID))
      .onSnapshot(snapshot => {
        resolve();
        setStateOfAllIndicators(snapshot.data() || {});
        INDICATOR_CHANGE_CALLBACKS.forEach(cb => cb());
      }, error => {
        console.error(error);
        reject(error);
      });
  });
}

let indicators = document.querySelectorAll(".indicator");

function setStateOfAllIndicators(data) {
  indicators.forEach(indicator => {
    let currentIndicator = convertIndicatorForBackwardCompatibility(data[indicator.dataset.slug]) || DEFAULT_INDICATOR;
    indicator.dataset.currentIndicator = currentIndicator;
    indicator.querySelector(".indicator-icon").textContent = INDICATOR_ICONS[currentIndicator];
  });
}

function indicatorListener(event) {
  event.preventDefault();

  let newValue = Object.entries(INDICATOR_TRANSITIONS)
    .find(([indicator]) => this.dataset.currentIndicator === indicator)[1]({
      userFlags,
      shift: event.shiftKey,
      ctrl: event.ctrlKey,
      alt: event.altKey,
      altGr: event.ctrlKey && event.altKey,
      meta: event.metaKey,
      left: event.button === 0,
      middle: event.button === 1,
      right: event.button === 2,
    });

  firebase.firestore().collection("db").doc("v1")
    .collection("users").doc(sessionStorage.getItem(SELECTED_USER_ID))
    .set({[this.dataset.slug]: newValue}, {merge: true})
    .catch(error => console.error(error));
}

indicators.forEach(indicator => {
  indicator.addEventListener("click", indicatorListener, false);
  indicator.addEventListener("auxclick", indicatorListener, false);
  indicator.addEventListener("contextmenu", e => e.preventDefault(), false);
});

let removeFirebaseNoteListener = () => {
};

function addFirebaseNoteListener() {
  return new Promise((resolve, reject) => {
    removeFirebaseNoteListener = firebase.firestore()
      .collection("db").doc("v1")
      .collection("users").doc(sessionStorage.getItem(SELECTED_USER_ID))
      .collection("metadata").doc("notes")
      .onSnapshot(snapshot => {
        resolve();
        setStateOfAllNotes(snapshot.data() || {});
      }, error => {
        console.error(error);
        reject(error);
      });
  });
}

let notes = document.querySelectorAll(".note");

function setStateOfAllNotes(data) {
  notes.forEach(note => {
    note.classList.toggle("note-empty", !data[note.dataset.slug]);
    note.querySelector(".note-value").textContent = data[note.dataset.slug];
  });
}

function noteListener(event) {
  event.preventDefault();
  event.stopPropagation();

  let newValue = prompt("New value:", this.parentElement.querySelector(".note-value").textContent);
  firebase.firestore().collection("db").doc("v1")
    .collection("users").doc(sessionStorage.getItem(SELECTED_USER_ID))
    .collection("metadata").doc("notes")
    .set({[this.parentElement.dataset.slug]: newValue}, {merge: true})
    .catch(error => console.error(error));
}

notes.forEach(note => {
  let changer = note.querySelector(".note-changer");
  changer.addEventListener("keypress", noteListener, false);
  changer.addEventListener("click", noteListener, false);
});

function saveUserData({uid, displayName, email, photoURL}) {
  return firebase.firestore()
    .collection("db").doc("v1")
    .collection("users").doc(uid)
    .set({__user: {uid, displayName, email, photoURL}}, {merge: true})
    .catch(error => console.error(error));
}

let removeFirebaseFlagsListener = () => {
};

let userFlags = {};

function addFirebaseFlagsListener() {
  return new Promise((resolve, reject) => {
    removeFirebaseFlagsListener = firebase.firestore()
      .collection("db").doc("v1")
      .collection("users").doc(sessionStorage.getItem(SELECTED_USER_ID))
      .collection("metadata").doc("flags")
      .onSnapshot(snapshot => {
        resolve();
        userFlags = snapshot.data() || {};
      }, error => {
        console.error(error);
        userFlags = {};
        reject(error);
      });
  });
}

let removeAdminListener = () => {
};

let isAdmin = false;

function addAdminSelectbox() {
  return firebase.firestore()
    .collection("db").doc("v1")
    .collection("users").doc(firebase.auth().currentUser.uid)
    .get()
    .then(snapshot => {
      if (snapshot.data().__user.isAdmin) {
        return new Promise((resolve, reject) => {
          removeAdminListener = firebase.firestore()
            .collection("db").doc("v1")
            .collection("users")
            .onSnapshot(snapshot => {
              let data = snapshot.docs.map(s => s.data() || {});
              resolve(data);
              fillAdminSelectbox(data);
              document.body.classList.add("admin");
              isAdmin = true;
              ADMIN_USER_SELECTED_CALLBACKS.forEach(cb => cb());
            }, error => {
              console.error(error);
              reject(error);
            });
        });
      }
    });
}

let adminSelect = document.querySelector(".user-select select");

function fillAdminSelectbox(users) {
  adminSelect.innerHTML = "";
  users
    .filter(user => user.__user && user.__user.uid)
    .map(user => [user.__user.displayName || user.__user.email || user.__user.uid, user.__user.uid])
    .sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)
    .map(([label, uid]) => new Option(label, uid))
    .forEach(option => adminSelect.add(option));
  adminSelect.value = sessionStorage.getItem(SELECTED_USER_ID);
}

adminSelect.addEventListener("change", () => {
  sessionStorage.setItem(SELECTED_USER_ID, adminSelect.value);
  ADMIN_USER_SELECTED_CALLBACKS.forEach(cb => cb());
  removeFirebaseIndicatorListener();
  removeFirebaseNoteListener();
  removeFirebaseFlagsListener();
  addFirebaseIndicatorListener();
  addFirebaseNoteListener();
  addFirebaseFlagsListener();
}, false);

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    if (!sessionStorage.getItem(SELECTED_USER_ID)) {
      sessionStorage.setItem(SELECTED_USER_ID, user.uid);
    }
    saveUserData(user)
      .then(() => addFirebaseIndicatorListener())
      .then(() => addFirebaseNoteListener())
      .then(() => addFirebaseFlagsListener())
      .then(() => addAdminSelectbox())
      .then(() => document.body.classList.add("logged-in"));
  } else {
    document.body.classList.remove("logged-in", "admin");
    isAdmin = false;
    removeFirebaseIndicatorListener();
    removeFirebaseNoteListener();
    removeFirebaseFlagsListener();
    removeAdminListener();
    sessionStorage.removeItem(SELECTED_USER_ID);
    USER_LOGGED_OUT_CALLBACKS.forEach(cb => cb());
  }
});

document.querySelector(".login").addEventListener("click", () => {
  firebase.auth()
    .signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .catch(error => {
      console.error(error);
    });
}, false);

document.querySelector(".logout").addEventListener("click", () => {
  firebase.auth()
    .signOut()
    .catch(error => {
      console.error(error);
    });
}, false);
