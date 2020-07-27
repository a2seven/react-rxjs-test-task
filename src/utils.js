export const randomInt = (min, max) => {
  return min + Math.floor((max - min) * Math.random());
};

export const randomFloat = (min, max) => {
  return (min + (max - min) * Math.random()).toFixed(2);
};