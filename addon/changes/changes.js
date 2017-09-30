import Ember from 'ember';
import ModelMixin from 'documents/document/-model-mixin';

const {
  computed,
  computed: { reads },
  assign
} = Ember;

const adapter = () => computed(function() {
  return this._internal.adapter(true, false);
}).readOnly();

const adapterPropertyKeys = [ 'isStarted', 'isSuspended' ];
const internalPropertyKeys = [ 'isError', 'error' ];
const stateKeys = [ ...adapterPropertyKeys, ...internalPropertyKeys ];

const adapterProperties = {};
adapterPropertyKeys.forEach(key => {
  adapterProperties[key] = reads(`_adapter.${key}`).readOnly();
});

const internalProperties = {};
internalPropertyKeys.forEach(key => {
  internalProperties[key] = computed(function() {
    return this._internal.state[key];
  }).readOnly();
});

const state = () => computed(...stateKeys, function() {
  return this.getProperties(stateKeys);
}).readOnly();

export default Ember.Object.extend(ModelMixin, assign({
  _adapter: adapter(),
  state: state()
},adapterProperties, internalProperties));
