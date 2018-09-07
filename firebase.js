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

let removeFirebaseListener;
function addFirebaseListener(uid) {
  return new Promise((resolve, reject) => {
    removeFirebaseListener = firebase.firestore()
    .collection("db").doc("v1")
    .collection("users").doc(uid)
    .onSnapshot(snapshot => {
      resolve();
      setStateOfAllIndicators(snapshot.data());
    }, error => {
      console.error(error);
      reject(error);
    });
  });
}

function setStateOfAllIndicators(data) {
  document.querySelectorAll(".indicator").forEach(indicator => {
    indicator.classList.toggle("is-done", Boolean(data[indicator.dataset.slug]));
  });
}

let indicatorButton = document.querySelector(".indicator-button");
let indicatorButtonListener;
function addIndicatorButtonListener(uid) {
  if (indicatorButton) {
    indicatorButtonListener = () => {
      let isDone = indicatorButton.classList.contains("is-done");
      firebase.firestore().collection("db").doc("v1")
        .collection("users").doc(uid)
        .update(indicatorButton.dataset.slug, !isDone)
        .catch(error => console.error(error));
    };
    indicatorButton.addEventListener("click", indicatorButtonListener, false);
  }
}
function removeIndicatorButtonListener() {
  if (indicatorButton) {
    indicatorButton.removeEventListener("change", indicatorButtonListener);
  }
}

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    addFirebaseListener(user.uid)
      .then(() => {
        addIndicatorButtonListener(user.uid);
        document.body.classList.add("logged-in");
      });
  } else {
    document.body.classList.remove("logged-in");
    removeIndicatorButtonListener();
    removeFirebaseListener();
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
