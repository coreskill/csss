const bsHtmlElement = document.querySelector("html")
const themeButtonGroup = document.querySelector(".ui-theme");
const prefersColorSchemeDark = window.matchMedia("(prefers-color-scheme: dark)");

const setUiTheme = (theme) => {
  bsHtmlElement.setAttribute("data-bs-theme", theme)
  themeButtonGroup.querySelectorAll("button").forEach(button => {
    if (button.textContent.toLowerCase() === theme) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  })

  prefersColorSchemeDark.removeEventListener("change", bsUpdateTheme);

  if (theme === "auto") {
    prefersColorSchemeDark.addEventListener("change", bsUpdateTheme);
    bsUpdateTheme();
  }
};

const bsUpdateTheme = () => {
  bsHtmlElement.setAttribute(
    "data-bs-theme",
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  )
}

setUiTheme("auto");

themeButtonGroup.addEventListener("click", (event) => {
  const clickedThemeButton = event.target;

  if (clickedThemeButton.classList.contains("ui-theme-dark")) {
    theme = "dark";
  } else if (clickedThemeButton.classList.contains("ui-theme-light")) {
    theme = "light";
  } else if (clickedThemeButton.classList.contains("ui-theme-auto")) {
    theme = "auto";
  } else {
    return;
  }

  firebase.firestore().collection("db").doc("v1")
    .collection("users").doc(firebase.auth().currentUser.uid)
    .set({__user: {uiTheme: theme}}, {merge: true})
    .catch(error => console.error(error));
})
