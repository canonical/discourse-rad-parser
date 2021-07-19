const radTabsElementClassName = '.js-rad-tabs-element';
const radDropdownElementClassName = '.js-rad-dropdown-element';
const radContentElementClassName = '.js-rad-content-element';

export const DiscourseRADParser = () => {
  const radTabsElements = document.querySelectorAll(
    `${radTabsElementClassName}`
  );

  radTabsElements.forEach((radTabsElement) => {
    const radDropdownElements = radTabsElement.querySelectorAll(
      `${radDropdownElementClassName}`
    );

    setDefaults(radDropdownElements);
    setupDropdowns(radDropdownElements);
  });

  toggleElements();
};

const setDefaults = (radDropdownElements) => {
  radDropdownElements.forEach((radDropdownElement) => {
    const name = radDropdownElement.name;
    const radDropdownElementOptions = radDropdownElement.querySelectorAll(
      'option'
    );

    let defaultWasSet = false;
    radDropdownElementOptions.forEach((radDropdownElementOption) => {
      if (localStorage.getItem(name) === radDropdownElementOption.value) {
        defaultWasSet = true;
        radDropdownElementOption.setAttribute('selected', 'selected');
      }
    });

    if (!defaultWasSet && localStorage.getItem(name) === null) {
      localStorage.setItem(name, radDropdownElement.firstElementChild.value);
    }
  });
};

const setupDropdowns = (radDropdownElements) => {
  radDropdownElements.forEach((radDropdownElement) => {
    attachDropdownEvents(radDropdownElement);
  });
};

const attachDropdownEvents = (radDropdownElement) => {
  radDropdownElement.addEventListener('change', (e) => {
    const newValue = e.target.value;
    const dropdownName = radDropdownElement.name;

    localStorage.setItem(dropdownName, newValue);

    const allRadDropdownElements = document.querySelectorAll(
      `${radDropdownElementClassName}`
    );
    allRadDropdownElements.forEach((dropdown) => {
      if (
        dropdown.name === dropdownName &&
        dropdown.innerHTML.indexOf('value="' + newValue + '"') > -1
      ) {
        dropdown.value = newValue;
      }
    });

    toggleElements();
  });
};

const toggleElements = () => {
  const radContentElements = document.querySelectorAll(
    `${radContentElementClassName}`
  );

  radContentElements.forEach((radContentElement) => {
    for (const criteriaName in radContentElement.dataset) {
      const criteriaValue = localStorage.getItem(criteriaName);
      const criteriaValuesList = radContentElement.dataset[criteriaName].split(
        ','
      );

      if (!criteriaValuesList.includes(criteriaValue)) {
        radContentElement.classList.add('u-hide');
        radContentElement.setAttribute('aria-hidden', true);

        return;
      }
    }

    radContentElement.classList.remove('u-hide');
    radContentElement.setAttribute('aria-hidden', false);
  });
};
