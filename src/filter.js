const allItems = document.querySelectorAll(".skill-item");
const allGroups = document.querySelectorAll(".skill-group");
const allColumns = document.querySelectorAll(".skill-section");
const nothingFound = document.querySelector(".filter-nothing-found");

const doneFilter = document.querySelector(".filter-done");
const starFilter = document.querySelector(".filter-star");
const notDoneOrMaybeFilter = document.querySelector(".filter-not-done-or-maybe");
const extraFilter = document.querySelector(".filter-extra");

const levelFilter1 = document.querySelector(".filter-level-1");
const levelFilter2 = document.querySelector(".filter-level-2");
const levelFilter3 = document.querySelector(".filter-level-3");
const levelFilter4 = document.querySelector(".filter-level-4");
const levelFilter5 = document.querySelector(".filter-level-5");

const filterCounter = document.querySelector(".filter-counter");
const shownSkills = document.querySelector(".shown-skills");

const allItemsCount = allItems.length

document.querySelector(".total-skills").innerHTML = allItemsCount;

const FILTERS_VALUE = "FILTERS_VALUE";

function filterItems() {
  let filtersValue = {
    done: doneFilter.classList.contains("active"),
    star: starFilter.classList.contains("active"),
    notDoneOrMaybe: notDoneOrMaybeFilter.classList.contains("active"),
    extra: extraFilter.classList.contains("active"),
    level1: levelFilter1.classList.contains("active"),
    level2: levelFilter2.classList.contains("active"),
    level3: levelFilter3.classList.contains("active"),
    level4: levelFilter4.classList.contains("active"),
    level5: levelFilter5.classList.contains("active"),
  };

  allItems.forEach(el => {
    let indicator = el.querySelector(".indicator");
    let type = indicator.classList.contains("is-done") ? "done"
      : indicator.classList.contains("is-star") ? "star"
      : "notDoneOrMaybe";
    let isExtra = indicator.classList.contains("is-extra");
    let isLevel1 = indicator.classList.contains("is-level-1");
    let isLevel2 = indicator.classList.contains("is-level-2");
    let isLevel3 = indicator.classList.contains("is-level-3");
    let isLevel4 = indicator.classList.contains("is-level-4");
    let isLevel5 = indicator.classList.contains("is-level-5");

    let isActive =
      (isLevel1 && !filtersValue.level1) ||
      (isLevel2 && !filtersValue.level2) ||
      (isLevel3 && !filtersValue.level3) ||
      (isLevel4 && !filtersValue.level4) ||
      (isLevel5 && !filtersValue.level5) ||
      (isExtra && !filtersValue.extra) ? false : filtersValue[type];

    el.classList.toggle("d-flex", isActive);
    el.classList.toggle("d-none", !isActive);
  });

  allGroups.forEach(el => {
    let addOrRemove = el.querySelectorAll(".skill-item.d-flex").length === 0 && (filtersValue.done || filtersValue.star || filtersValue.notDoneOrMaybe);
    el.classList.toggle("d-none", addOrRemove);
    el.previousElementSibling.classList.toggle("d-none", addOrRemove);
  });

  allColumns.forEach(el => {
    let addOrRemove = el.querySelectorAll(".skill-group:not(.d-none)").length === 0;
    el.classList.toggle("d-none", addOrRemove);
  });

  let nothingWasFound = document.querySelectorAll(".skill-item.d-flex").length === 0 && (filtersValue.done || filtersValue.star || filtersValue.notDoneOrMaybe);
  nothingFound.classList.toggle("d-none", !nothingWasFound);

  let shownSkillsCount = document.querySelectorAll(".skill-item.d-flex").length;

  if (shownSkillsCount === allItemsCount) {
    filterCounter.classList.add("d-none");
  } else {
    filterCounter.classList.remove("d-none");
  }

  if (shownSkillsCount) {
    shownSkills.innerHTML = `${shownSkillsCount} (${Math.round(shownSkillsCount / allItemsCount * 100)} %)`;
  } else {
    shownSkills.innerHTML = `None`;
  }
}

function showAllItems() {
  allItems.forEach(el => {
    el.classList.add("d-flex");
    el.classList.remove("d-none");
    el.querySelector(".indicator").classList.remove("is-done", "is-star");
  });

  allGroups.forEach(el => {
    el.classList.remove("d-none");
    el.previousElementSibling.classList.remove("d-none");
  });

  nothingFound.classList.add("d-none");
}

function saveFilters() {
  let filtersStateToSave = {
    done: doneFilter.classList.contains("active"),
    star: starFilter.classList.contains("active"),
    notDone: notDoneOrMaybeFilter.classList.contains("active"),
    extra: extraFilter.classList.contains("active"),
    level1: levelFilter1.classList.contains("active"),
    level2: levelFilter2.classList.contains("active"),
    level3: levelFilter3.classList.contains("active"),
    level4: levelFilter4.classList.contains("active"),
    level5: levelFilter5.classList.contains("active"),
  };

  let filtersKey = FILTERS_VALUE;
  if (isAdmin) {
    let userId = sessionStorage.getItem(SELECTED_USER_ID);
    filtersKey = `${FILTERS_VALUE}__${userId}`;
  }

  try {
    localStorage.setItem(filtersKey, JSON.stringify(filtersStateToSave));
  } catch (e) {
  }
}

function loadFilters() {
  let filtersKey = FILTERS_VALUE;
  if (isAdmin) {
    let userId = sessionStorage.getItem(SELECTED_USER_ID);
    filtersKey = `${FILTERS_VALUE}__${userId}`;
  }

  let filtersStateToLoad = localStorage.getItem(filtersKey);
  if (filtersStateToLoad) {
    try {
      filtersStateToLoad = JSON.parse(filtersStateToLoad);
      doneFilter.classList.toggle("active", filtersStateToLoad.done);
      starFilter.classList.toggle("active", filtersStateToLoad.star);
      notDoneOrMaybeFilter.classList.toggle("active", filtersStateToLoad.notDone);
      extraFilter.classList.toggle("active", filtersStateToLoad.extra);
      levelFilter1.classList.toggle("active", filtersStateToLoad.level1);
      levelFilter2.classList.toggle("active", filtersStateToLoad.level2);
      levelFilter3.classList.toggle("active", filtersStateToLoad.level3);
      levelFilter4.classList.toggle("active", filtersStateToLoad.level4);
      levelFilter5.classList.toggle("active", filtersStateToLoad.level5);
    } catch (e) {
    }
  }
}

function onFilterButtonClick(e) {
  e.target.classList.toggle("active");
  saveFilters();
  filterItems();
}

[doneFilter, starFilter, notDoneOrMaybeFilter, extraFilter, levelFilter1, levelFilter2, levelFilter3, levelFilter4, levelFilter5]
  .forEach(el => el.addEventListener("click", onFilterButtonClick));
loadFilters();
INDICATOR_CHANGE_CALLBACKS.push(filterItems);
USER_LOGGED_OUT_CALLBACKS.push(showAllItems);
ADMIN_USER_SELECTED_CALLBACKS.push(loadFilters, filterItems);
