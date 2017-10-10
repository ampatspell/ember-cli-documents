import Ember from 'ember';
import ModelMixin from './-model-mixin';
import LoaderStateMixin from './-loader-state-mixin';
import { promise } from './-properties';

export default Ember.Object.extend(ModelMixin, LoaderStateMixin, {

  _internal: null,

  load:   promise('scheduleLoad'),
  reload: promise('scheduleReload')

});
