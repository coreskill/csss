const bsHtmlElement = document.querySelector("html")
const themeButtonGroup = document.querySelector(".ui-theme");

const getUserPreference = () => {
  return "auto" // todo return __user.uiTheme from firebase
}

if (typeof getUserPreference() === 'string') {
  bsHtmlElement.setAttribute("data-bs-theme", getUserPreference())
  themeButtonGroup.querySelectorAll("button").forEach(button => {
    if (button.textContent.toLowerCase() === getUserPreference()) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  })
}

const bsUpdateTheme = () => {
  bsHtmlElement.setAttribute(
    "data-bs-theme",
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  )
}

if (bsHtmlElement.getAttribute("data-bs-theme") === "auto") {
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", bsUpdateTheme)
  bsUpdateTheme()
}

themeButtonGroup.addEventListener("click", (event) => {
  const clickedThemeButton = event.target;

  themeButtonGroup.querySelectorAll("button").forEach(button => {
    button.classList.remove("active");
  })

  const changeTheme = (theme) => {
    bsHtmlElement.setAttribute("data-bs-theme", theme);
    firebase.firestore().collection("db").doc("v1")
      .collection("users").doc(firebase.auth().currentUser.uid)
      .set({__user: {uiTheme: theme}}, {merge: true})
      .catch(error => console.error(error));
    clickedThemeButton.classList.add("active");
  }

  if (clickedThemeButton.classList.contains("ui-theme-dark")) {
    changeTheme("dark");
  } else if (clickedThemeButton.classList.contains("ui-theme-light")) {
    changeTheme("light");
  } else if (clickedThemeButton.classList.contains("ui-theme-auto")) {
    changeTheme("auto");
  }
})
