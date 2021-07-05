export const DiscourseRADParser = () => {
  const radTabsElements = document.querySelectorAll('.rad-tabs-element');

  radTabsElements.forEach((radTabsElement) => {
    setDefaults(radTabsElement);
    setupDropdowns(radTabsElement);
  });

  toggleElements();
}

const setDefaults = radTabsElement => {
  const dropdowns = radTabsElement.querySelectorAll('select');

  dropdowns.forEach((dropdown) => {
    const name = dropdown.name;

    const options = dropdown.querySelectorAll('option');
    let defaultWasSet = false;
    options.forEach((option) => {
      if (localStorage.getItem(name) === option.value) {
        defaultWasSet = true;
        option.setAttribute('selected', 'selected');
      }
    });

    if (!defaultWasSet) {
      const firstOption = dropdown.firstElementChild;
      firstOption.setAttribute('selected', 'selected');

      if (localStorage.getItem(name) === null) {
        localStorage.setItem(name, firstOption.value);
      }
    }
  });
}

const setupDropdowns = radTabsElement => {
  const dropdowns = radTabsElement.querySelectorAll('select');

  dropdowns.forEach(function (dropdown) {
    attachDropdownEvents(dropdown);
  });
}

const attachDropdownEvents = dropdown => {
  dropdown.addEventListener('change', function (e) {
    const newValue = e.target.value;
    const dropdownName = dropdown.name;

    localStorage.setItem(dropdownName, newValue);

    const dropdowns = document.querySelectorAll(`select[name=${dropdownName}][class*=rad-dropdown-element]`);
    dropdowns.forEach(function (element) {
      if (element.innerHTML.indexOf('value="' + newValue + '"') > -1) {
        element.value = newValue;
      }
    });

    toggleElements();
  });
}

const toggleElements = () => {
  const elements = document.querySelectorAll('.rad-content-element');

  elements.forEach(function (element) {
    for (const criteriaName in element.dataset) {
      const criteriaValue = localStorage.getItem(criteriaName);

      if (!element.dataset[criteriaName].split(',').includes(criteriaValue)) {
        element.classList.add('u-hide');
        element.setAttribute('aria-hidden', true);
        return;
      }
    }

    element.classList.remove('u-hide');
    element.setAttribute('aria-hidden', false);
  })
}
