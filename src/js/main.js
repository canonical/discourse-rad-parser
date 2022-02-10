const radTabsElementClassName = '.js-rad-tabs-element';
const radDropdownElementClassName = '.js-rad-dropdown-element';
const radContentElementClassName = '.js-rad-content-element';

export const DiscourseRADParser = () => {
  initRad();

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

const initRad = () => {
  const radTabsElements = document.querySelectorAll(
    `${radTabsElementClassName}`
  );

  radTabsElements.forEach((radTabsElement) => {
    const tabs = radTabsElement.querySelectorAll(
      `${radContentElementClassName}`
    );
    const header = document.createElement('div');
    header.classList.add('p-code-snippet__header');
    const dropdowns = document.createElement('div');
    dropdowns.classList.add('p-code-snippet__dropdowns');

    radTabsElement.classList.add('p-code-snippet');

    const dropdownSettings = getDropdownSettings(tabs);
    for (let i = 0; i < dropdownSettings.length; i++) {
      const dropdownName = dropdownSettings[i].name;
      const dropdown = document.createElement('select');
      dropdown.setAttribute('name', dropdownName);
      const dropdownOptions = dropdownSettings[i].options;

      dropdown.classList.add(`js-rad-dropdown-element`);
      dropdown.classList.add('p-code-snippet__dropdown');

      if (dropdownOptions.length === 0) {
        continue;
      }

      for (let i = 0; i < dropdownOptions.length; i++) {
        const optionValue = dropdownOptions[i];
        const optionLabel = optionValue.replace('-', ' ');
        const option = document.createElement('option');
        option.value = optionValue;
        option.innerHTML = optionLabel;

        dropdown.append(option);
      }

      dropdowns.append(dropdown);
    }
    header.append(dropdowns);

    tabs.forEach(function (option) {
      option.classList.add('p-code-snippet__block');
    });

    radTabsElement.prepend(header);
  });
};

const getDropdownSettings = (tabs) => {
  let dropdownSettings = [];
  let attributesList = [];

  tabs.forEach((tab) => {
    const attributes = tab.dataset;
    let dropdownsOrder = [];

    for (const attributeName in attributes) {
      let attributeValue = tab.dataset[attributeName];

      if (!(attributeName in attributesList)) {
        dropdownsOrder.push(attributeName);
        attributesList[attributeName] = [];
      }

      const splitValues = attributeValue.split(',');
      for (let i = 0; i < splitValues.length; i++) {
        if (attributesList[attributeName].indexOf(splitValues[i]) === -1) {
          attributesList[attributeName].push(splitValues[i]);
        }
      }
    }

    for (let i = 0; i < dropdownsOrder.length; i++) {
      dropdownSettings.unshift({
        name: dropdownsOrder[i],
        options: attributesList[dropdownsOrder[i]],
      });
    }
  });

  return dropdownSettings;
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
