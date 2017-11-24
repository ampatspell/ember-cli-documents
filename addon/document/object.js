import EmberObject from '@ember/object';
import ModelMixin from './-model-mixin';
import UnknownPropertiesMixin from './-unknown-properties-mixin';
import { markModel } from '../util/internal';

export default markModel(EmberObject.extend(ModelMixin, UnknownPropertiesMixin));
