import isModel from './is-model';

export default value => isModel(value) ? value._internal : value;
