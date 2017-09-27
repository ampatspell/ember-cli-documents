import Ember from 'ember';

const {
  RSVP: { Promise },
  run
} = Ember;

export const later = delay => new Promise(resolve => run.later(resolve, delay));
export const next = () => new Promise(resolve => run.next(resolve));
