import isInternal from './is-internal';

export default value => isInternal(value) ? value.model(true) : value;
