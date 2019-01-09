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
const INDICATOR_CHANGE_CALLBACKS = [];

let removeFirebaseIndicatorListener = () => {};
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
    indicator.classList.toggle("is-done", data[indicator.dataset.slug] === true);
    indicator.classList.toggle("is-star", data[indicator.dataset.slug] === 'star');
  });
}

function indicatorListener(event) {
  event.preventDefault();

  let isDone = this.classList.contains("is-done");
  let isStar = this.classList.contains("is-star");
  let newValue = isDone ? false : isStar ? true : 'star';
  firebase.firestore().collection("db").doc("v1")
    .collection("users").doc(sessionStorage.getItem(SELECTED_USER_ID))
    .set({[this.dataset.slug]: newValue}, {merge: true})
    .catch(error => console.error(error));
};
indicators.forEach(indicator => {
  indicator.addEventListener("click", indicatorListener, false);
});

let removeFirebaseNoteListener = () => {};
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
};
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

let removeAdminListener = () => {};
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
  removeFirebaseIndicatorListener();
  removeFirebaseNoteListener();
  addFirebaseIndicatorListener();
  addFirebaseNoteListener();
}, false);

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    if (!sessionStorage.getItem(SELECTED_USER_ID)) {
      sessionStorage.setItem(SELECTED_USER_ID, user.uid);
    }
    saveUserData(user)
      .then(() => addFirebaseIndicatorListener())
      .then(() => addFirebaseNoteListener())
      .then(() => addAdminSelectbox())
      .then(() => document.body.classList.add("logged-in"));
  } else {
    document.body.classList.remove("logged-in", "admin");
    removeFirebaseIndicatorListener();
    removeFirebaseNoteListener();
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
