export const LS_KEYS = {
  currentTime: 'videoplayer-current-time',
  feedbackForm: 'feedback-form-state',
};

export const readFromLS = key => {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (error) {
    console.error(error.message);
  }
};

export const writeToLS = (key, value) =>
  localStorage.setItem(key, JSON.stringify(value));

export const removeFromLS = key => {
  localStorage.removeItem(key);
};

export const thereAreEmptyInputs = (form, expectedInputQuantity) => {
  const formValues = Object.values(form);
  if (
    formValues.length < expectedInputQuantity ||
    formValues.some(val => val === '')
  ) {
    return true;
  }
};
