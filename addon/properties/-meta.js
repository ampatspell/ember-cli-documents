import EmberObject from '@ember/object';
import { copy } from '@ember/object/internals';

const __documents_definition__ = '__documents_definition__';

export const withDefinition = (property, definition) => {
  property.meta({ [__documents_definition__]: copy(definition, true) });
  return property;
}

export const getDefinition = (owner, key) => {
  if(EmberObject.detectInstance(owner)) {
    owner = owner.constructor;
  }
  let meta = owner.metaForProperty(key);
  return meta && meta[__documents_definition__];
};
