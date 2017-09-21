import Ember from 'ember';

const {
  copy
} = Ember;

const replace = (from, to, json) => {
  let value = json[from];
  delete json[from];
  json[to] = value;
  return json;
};

export default json => {
  json = json ? copy(json, false) : {};
  replace('id', '_id', json);
  replace('rev', '_rev', json);
  return json;
}
