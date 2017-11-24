import EmberObject, { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import Evented from '@ember/object/evented';
import ModelMixin from 'documents/document/-model-mixin';

const adapterKeys = [ 'isStarted', 'isSuspended' ];
const internalStateKeys = [ 'isError', 'error' ];
const stateKeys = [ ...adapterKeys, ...internalStateKeys ];
const internalMethods = [ 'start', 'stop', 'restart', 'suspend' ];

const props = {};

props._adapter = computed(function() {
  return this._internal.adapter(true, false);
}).readOnly();

adapterKeys.forEach(key => {
  props[key] = reads(`_adapter.${key}`).readOnly();
});

internalStateKeys.forEach(key => {
  props[key] = computed(function() {
    return this._internal.state[key];
  }).readOnly();
});

props.state = computed(...stateKeys, function() {
  return this.getProperties(stateKeys);
}).readOnly();

internalMethods.forEach(key => {
  props[key] = function() {
    let internal = this._internal;
    return internal[key].call(internal, ...arguments);
  }
});

export default EmberObject.extend(Evented, ModelMixin, props);
