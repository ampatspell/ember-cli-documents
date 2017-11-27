import { computed } from '@ember/object';
import { getOwner } from '@ember/application';

const lookup = owner => getOwner(owner).lookup('documents:stores');

export const stores = () => computed(function() {
  return lookup(this);
});

export const store = identifier => computed(function() {
  return lookup(this).store(identifier);
});

export const database = (storeIdentifier, databaseIdentifier) => computed(function() {
  return lookup(this).store(storeIdentifier).database(databaseIdentifier);
});
