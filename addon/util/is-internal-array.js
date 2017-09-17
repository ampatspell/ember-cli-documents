import isInternal from './is-internal';

export default value => value && isInternal(value) && value.constructor.type === 'array';
