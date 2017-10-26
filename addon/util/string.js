export const isBlank = string => {
  if(typeof string !== 'string') {
    return true;
  }
  return string.trim().length === 0;
};
