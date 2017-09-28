import Ember from 'ember';

const {
  RSVP: { Promise },
  run
} = Ember;

export const next = () => new Promise(resolve => run.next(resolve));
