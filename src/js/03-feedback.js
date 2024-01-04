import throttle from 'lodash.throttle';
import {
  LS_KEYS,
  readFromLS,
  removeFromLS,
  thereAreEmptyInputs,
  writeToLS,
} from './common';

const form = document.querySelector('form.feedback-form');

let formData = readFromLS(LS_KEYS.feedbackForm) ?? {};

const handleSubmit = e => {
  e.preventDefault();

  if (thereAreEmptyInputs(formData, 2)) {
    alert('❌ All inputs should be filled!');
    return;
  }

  removeFromLS(LS_KEYS.feedbackForm);
  form.reset();
  console.log(formData);
  formData = {};
};

const handleInput = throttle(e => {
  formData[e.target.name] = e.target.value.replace(/\s+/g, ' ').trim();
  writeToLS(LS_KEYS.feedbackForm, formData);
}, 1000);

const handleLoad = () => {
  try {
    const persistedData = readFromLS(LS_KEYS.feedbackForm);

    if (persistedData) {
      for (let el of form.elements) {
        const { name, nodeName } = el;

        if (nodeName === 'TEXTAREA' || nodeName === 'INPUT') {
          el.value = persistedData[name] ?? '';
        }
      }
    }
  } catch (error) {
    console.error(error.message);
  }
};

window.addEventListener('load', handleLoad);
form.addEventListener('submit', handleSubmit);
form.addEventListener('input', handleInput);
