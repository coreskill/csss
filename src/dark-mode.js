const bsHtmlElement = document.querySelector("html")
const bsUpdateTheme = () => {
  bsHtmlElement.setAttribute(
    "data-bs-theme",
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
};
if (bsHtmlElement.getAttribute("data-bs-theme") === 'auto') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', bsUpdateTheme)
  bsUpdateTheme()
}
