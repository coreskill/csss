const allItems = document.querySelectorAll(".skill-item");
const allGroups = document.querySelectorAll(".skill-group");
const allColumns = document.querySelectorAll(".skill-section");
const nothingFound = document.querySelector(".filter-nothing-found");

const levelFilters = document.querySelectorAll(".filter-level");

const filterCounter = document.querySelector(".filter-counter");
const shownSkills = document.querySelector(".shown-skills");

const allItemsCount = allItems.length

document.querySelector(".total-skills").innerHTML = allItemsCount;

const filterPlaceholder = document.querySelector(".filter-indicator");
const filterContainer = filterPlaceholder.parentElement;
filterPlaceholder.remove();

const indicatorFilters = Object.keys(INDICATOR_BIG_FILTERS).map(icon => {
  let filterButton = filterPlaceholder.cloneNode(true);
  filterButton.textContent = icon;
  filterButton.dataset.icon = icon;
  filterContainer.appendChild(filterButton);
  return filterButton;
});

const FILTERS_VALUE = "FILTERS_VALUE";

function getFiltersValues() {
  let levelFiltersValues = {};
  levelFilters.forEach(el => {
    levelFiltersValues[el.dataset.level] = el.classList.contains("active");
  });

  let indicatorFiltersValues = {};
  indicatorFilters.forEach(el => {
    INDICATOR_BIG_FILTERS[el.dataset.icon].forEach(indicator => {
      indicatorFiltersValues[indicator] = el.classList.contains("active");
    });
  });

  return {levelFiltersValues, indicatorFiltersValues};
}

function filterItems() {
  let {levelFiltersValues, indicatorFiltersValues} = getFiltersValues();
  levelFiltersValues[0] = levelFiltersValues[1];

  allItems.forEach(el => {
    let indicator = el.querySelector(".indicator");

    let isActiveByLevel = levelFiltersValues[indicator.dataset.level];
    let isActiveByIndicator = indicatorFiltersValues[indicator.dataset.currentIndicator];
    let isActive = isActiveByLevel && isActiveByIndicator;

    el.classList.toggle("d-flex", isActive);
    el.classList.toggle("d-none", !isActive);
  });

  allGroups.forEach(el => {
    let addOrRemove = el.querySelectorAll(".skill-item.d-flex").length === 0;
    el.classList.toggle("d-none", addOrRemove);
    el.previousElementSibling.classList.toggle("d-none", addOrRemove);
  });

  allColumns.forEach(el => {
    let addOrRemove = el.querySelectorAll(".skill-group:not(.d-none)").length === 0;
    el.classList.toggle("d-none", addOrRemove);
  });

  let nothingWasFound = document.querySelectorAll(".skill-item.d-flex").length === 0;
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
    el.querySelector(".indicator .indicator-icon").textContent = "";
  });

  allGroups.forEach(el => {
    el.classList.remove("d-none");
    el.previousElementSibling.classList.remove("d-none");
  });

  nothingFound.classList.add("d-none");
}

function saveFilters() {
  let filtersStateToSave = getFiltersValues();

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

      // @TODO new implementation

      // backward compatibility
      if ("done" in filtersStateToLoad) {

        // @TODO backward compatibility implementation

    } catch (e) {
    }
  }
}

function onFilterButtonClick(e) {
  e.target.classList.toggle("active");
  saveFilters();
  filterItems();
}

[...indicatorFilters, ...levelFilters].forEach(el => el.addEventListener("click", onFilterButtonClick));
loadFilters();
INDICATOR_CHANGE_CALLBACKS.push(filterItems);
USER_LOGGED_OUT_CALLBACKS.push(showAllItems);
ADMIN_USER_SELECTED_CALLBACKS.push(loadFilters, filterItems);
