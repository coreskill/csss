const allItems = document.querySelectorAll(".skill-item");
const allGroups = document.querySelectorAll(".skill-group");
const allColumns = document.querySelectorAll(".skill-section");
const nothingFound = document.querySelector(".filter-nothing-found");

const doneFilter = document.querySelector(".filter-done");
const starFilter = document.querySelector(".filter-star");
const notDoneFilter = document.querySelector(".filter-not-done");
const extraFilter = document.querySelector(".filter-extra");
const shownSkills = document.querySelector(".shown-skills");

const allItemsCount = allItems.length

document.querySelector(".total-skills").innerHTML = allItemsCount;

const FILTERS_VALUE = "FILTERS_VALUE";

function filterItems() {
  let filtersValue = {
    done: doneFilter.classList.contains("active"),
    star: starFilter.classList.contains("active"),
    notDone: notDoneFilter.classList.contains("active"),
    extra: extraFilter.classList.contains("active"),
  };

  allItems.forEach(el => {
    let indicator = el.querySelector(".indicator");
    let type = indicator.classList.contains("is-done")
      ? "done" : indicator.classList.contains("is-star")
        ? "star" : "notDone";
    let isExtra = indicator.classList.contains("is-extra");

    let isActive = isExtra && ! filtersValue.extra ? false : filtersValue[type];

    el.classList.toggle("d-flex", isActive);
    el.classList.toggle("d-none", !isActive);
  });

  allGroups.forEach(el => {
    let addOrRemove = el.querySelectorAll(".skill-item.d-flex").length === 0 && (filtersValue.done || filtersValue.star || filtersValue.notDone);
    el.classList.toggle("d-none", addOrRemove);
    el.previousElementSibling.classList.toggle("d-none", addOrRemove);
  });

  allColumns.forEach(el => {
    let addOrRemove = el.querySelectorAll(".skill-group:not(.d-none)").length === 0;
    el.classList.toggle("d-none", addOrRemove);
  });

  let nothingWasFound = document.querySelectorAll(".skill-item.d-flex").length === 0 && (filtersValue.done || filtersValue.star || filtersValue.notDone);
  nothingFound.classList.toggle("d-none", !nothingWasFound);

  let shownSkillsCount = document.querySelectorAll(".skill-item.d-flex").length

  if (shownSkillsCount) {
    shownSkills.innerHTML = `${shownSkillsCount} (${Math.round(shownSkillsCount/allItemsCount * 100)} %)`;
  } else {
    shownSkills.innerHTML = `None`;
  }
}

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
  let filtersValue = {
    done: doneFilter.classList.contains("active"),
    star: starFilter.classList.contains("active"),
    notDone: notDoneFilter.classList.contains("active"),
    extra: extraFilter.classList.contains("active"),
  };

  try {
    localStorage.setItem(FILTERS_VALUE, JSON.stringify(filtersValue));
  } catch(e) {}
}

function loadFilters() {
  let filters = localStorage.getItem(FILTERS_VALUE);
  if (filters) {
    try {
      filters = JSON.parse(filters);
      doneFilter.classList.toggle("active", filters.done);
      starFilter.classList.toggle("active", filters.star);
      notDoneFilter.classList.toggle("active", filters.notDone);
      extraFilter.classList.toggle("active", filters.extra);
    } catch (e) {}
  }
}

function onFilterButtonClick(e) {
  e.target.classList.toggle("active");
  saveFilters();
  filterItems();
}

[doneFilter, starFilter, notDoneFilter, extraFilter].forEach(el => el.addEventListener("click", onFilterButtonClick));
loadFilters();
INDICATOR_CHANGE_CALLBACKS.push(filterItems);
USER_LOGGED_OUT_CALLBACKS.push(showAllItems);
