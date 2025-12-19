const getRundomItemFromArray = <T>(array: T[]): T => {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

const getRandomXposition = () => {
  return Math.floor(Math.random() * window.innerWidth);
};

export { getRundomItemFromArray, getRandomXposition };
