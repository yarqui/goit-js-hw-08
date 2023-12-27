export const readFromLS = key => {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (error) {
    console.error(error.message);
  }
};

export const writeToLS = (key, value) => {
  return localStorage.setItem(key, JSON.stringify(value));
};

export const removeFromLS = key => {
  localStorage.removeItem(key);
};
