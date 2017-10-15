import InternalBase from './-base';
import MutateMixin from './-mutate-mixin';
import DeserializeMixin from './-deserialize-mixin';
import SerializeMixin from './-serialize-mixin';
import EmptyObject from 'documents/util/empty-object';

export default class InternalObject extends SerializeMixin(DeserializeMixin(MutateMixin(InternalBase))) {

  static get type() {
    return 'object';
  }

  constructor(store, parent) {
    super(store, parent);
    this.values = new EmptyObject();
  }

  _createModel() {
    return this.store._createObjectModel(this);
  }

}
