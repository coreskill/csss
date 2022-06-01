let displayedFlags = ["intro"];

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

function loadUserList() {
  return firebase.firestore()
    .collection("db").doc("v1")
    .collection("users").doc(firebase.auth().currentUser.uid)
    .get()
    .then(snapshot => {
      if (snapshot.data().__user.isAdmin) {
        return firebase.firestore()
          .collection("db").doc("v1")
          .collection("users")
          .get()
          .then(snapshot => {
            return Promise.all(
              snapshot.docs
                .map(doc => doc.data())
                .filter(user => user.__user && user.__user.uid)
                .map(user => firebase.firestore()
                  .collection("db").doc("v1")
                  .collection("users").doc(user.__user.uid)
                  .collection("metadata").doc("flags")
                  .get()
                  .then(snapshot => ({
                    user: user.__user,
                    flags: snapshot.data() || {},
                  }))
                )
            );
          }).then(users => {
            fillUserList(users);
          }, error => {
            console.error(error);
          });
      }
    });
}

let userList = document.querySelector(".user-list tbody");

function fillUserList(users) {
  userList.innerHTML = "";
  users
    .map(userData => [userData.user.displayName || userData.user.email || userData.user.uid, userData])
    .sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)
    .forEach(([, {user, flags}]) => {
      let tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${user.displayName || ""} ${user.isAdmin ? "👮" : ""}</td>
        <td>${user.email || ""}</td>
        <td><code>${user.uid}</code></td>
        <td data-uid="${user.uid}">
          ${displayedFlags.map(flag => `<div class="form-check"><label class="form-check-label"><input type="checkbox" ${flags[flag] ? "checked" : ""} class="flag form-check-input" data-flag="${flag}">${flag}</label></div>`)}
        </td>
      `;
      userList.append(tr);
    });
}

userList.addEventListener("change", event => {
  let userId = event.target.closest("td").dataset.uid;
  let flag = event.target.dataset.flag;
  let newValue = event.target.checked;

  firebase.firestore().collection("db").doc("v1")
    .collection("users").doc(userId)
    .collection("metadata").doc("flags")
    .set({[flag]: newValue}, {merge: true})
    .catch(error => console.error(error));
}, false);

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    loadUserList()
      .then(() => document.body.classList.add("logged-in"));
  } else {
    document.body.classList.remove("logged-in");
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
