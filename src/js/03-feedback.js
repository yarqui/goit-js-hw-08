import throttle from 'lodash.throttle';
import { readFromLS, removeFromLS, writeToLS } from './common';

const form = document.querySelector('form.feedback-form');

const createFormData = target => {
  const data = {};
  const formData = new FormData(target);

  formData.forEach((value, key) => {
    data[key] = value;
  });

  return data;
};

const handleSubmit = e => {
  e.preventDefault();
  const data = createFormData(e.currentTarget);
  removeFromLS('feedback-form-state');
  form.reset();
  console.log(data);
};

const handleInput = throttle(e => {
  const data = createFormData(e.currentTarget);
  writeToLS('feedback-form-state', JSON.stringify(data));
}, 1000);

const handleLoad = () => {
  try {
    const persistedData = JSON.parse(readFromLS('feedback-form-state'));

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
