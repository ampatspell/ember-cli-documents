export const omit = (object, omit) => {
  let result = {};
  for(let key in object) {
    if(omit.includes(key)) {
      continue;
    }
    result[key] = object[key];
  }
  return result;
}

export const pick = (object, pick) => {
  let result = {};
  pick.forEach(key => {
    if(!object.hasOwnProperty(key)) {
      return;
    }
    result[key] = object[key];
  });
  return result;
}
