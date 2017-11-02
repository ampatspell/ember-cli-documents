import Ember from 'ember';
import model from 'documents/properties/model';

const {
  merge
} = Ember;

export const state = model.extend(() => ({
  create(owner) {
    let state = owner;
    return merge({ state }, this._super && this._super(...arguments));
  }
}));
