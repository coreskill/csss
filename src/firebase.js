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

let removeFirebaseListener = () => {};
function addFirebaseListener(uid) {
  return new Promise((resolve, reject) => {
    removeFirebaseListener = firebase.firestore()
    .collection("db").doc("v1")
    .collection("users").doc(uid)
    .onSnapshot(snapshot => {
      resolve();
      setStateOfAllIndicators(snapshot.data() || {});
    }, error => {
      console.error(error);
      reject(error);
    });
  });
}

let indicators = document.querySelectorAll(".indicator");
function setStateOfAllIndicators(data) {
  indicators.forEach(indicator => {
    indicator.classList.toggle("is-done", Boolean(data[indicator.dataset.slug]));
  });
}

let indicatorListener;
function addIndicatorListener(uid) {
  indicatorListener = function(event) {
    let isDone = this.classList.contains("is-done");
    firebase.firestore().collection("db").doc("v1")
      .collection("users").doc(uid)
      .set({[this.dataset.slug]: !isDone}, {merge: true})
      .catch(error => console.error(error));
    event.preventDefault();
  };
  indicators.forEach(indicator => {
    indicator.addEventListener("click", indicatorListener, false);
  });
}
function removeIndicatorListener() {
  indicators.forEach(indicator => {
    indicator.removeEventListener("click", indicatorListener);
  });
}

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    addFirebaseListener(user.uid)
      .then(() => {
        addIndicatorListener(user.uid);
        document.body.classList.add("logged-in");
      });
  } else {
    document.body.classList.remove("logged-in");
    removeIndicatorListener();
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
