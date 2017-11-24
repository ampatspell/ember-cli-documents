import { Promise } from 'rsvp';
import { run } from '@ember/runloop';

export const next = () => new Promise(resolve => run.next(resolve));
export const later = delay => new Promise(resolve => run.later(resolve, delay));
