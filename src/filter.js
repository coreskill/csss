let allItems = document.querySelectorAll(".skill-item");
let allGroups = document.querySelectorAll(".skill-group");
let nothingFound = document.querySelector(".filter-nothing-found");

let doneFilter = document.querySelector(".filter-done");
let starFilter = document.querySelector(".filter-star");
let notDoneFilter = document.querySelector(".filter-not-done");

const FILTERS_VALUE = "FILTERS_VALUE";

function filterItems() {
  let filters = {
    done: doneFilter.classList.contains("active"),
    star: starFilter.classList.contains("active"),
    notDone: notDoneFilter.classList.contains("active"),
  };

  allItems.forEach(el => {
    let indicator = el.querySelector(".indicator");
    let type = indicator.classList.contains("is-done") ? "done" : indicator.classList.contains("is-star") ? "star" : "notDone";
    let isActive = filters[type];

    el.classList.toggle("d-flex", isActive);
    el.classList.toggle("d-none", !isActive);
  });

  allGroups.forEach(el => {
    let addOrRemove = el.querySelectorAll(".skill-item.d-flex").length === 0;
    el.classList.toggle("d-none", addOrRemove);
    el.previousElementSibling.classList.toggle("d-none", addOrRemove);
  });

  let nothingWasFound = document.querySelectorAll(".skill-item.d-flex").length === 0;
  nothingFound.classList.toggle("d-none", !nothingWasFound);
};

function showAllItems() {
  allItems.forEach(el => {
    el.classList.add("d-flex");
    el.classList.remove("d-none");
  });

  allGroups.forEach(el => {
    el.classList.remove("d-none");
    el.previousElementSibling.classList.remove("d-none");
  });

  nothingFound.classList.add("d-none");
}

function saveFilters() {
  let filters = {
    done: doneFilter.classList.contains("active"),
    star: starFilter.classList.contains("active"),
    notDone: notDoneFilter.classList.contains("active"),
  };

  try {
    localStorage.setItem(FILTERS_VALUE, JSON.stringify(filters));
  } catch(e) {}
};

function loadFilters() {
  let filters = localStorage.getItem(FILTERS_VALUE);
  if (filters) {
    try {
      filters = JSON.parse(filters);
      doneFilter.classList.toggle("active", filters.done);
      starFilter.classList.toggle("active", filters.star);
      notDoneFilter.classList.toggle("active", filters.notDone);
    } catch (e) {}
  }
}

function onFilterButtonClick(e) {
  e.target.classList.toggle("active");
  saveFilters();
  filterItems();
}

[doneFilter, starFilter, notDoneFilter].forEach(el => el.addEventListener("click", onFilterButtonClick));
loadFilters();
INDICATOR_CHANGE_CALLBACKS.push(filterItems);
USER_LOGGED_OUT_CALLBACKS.push(showAllItems);
