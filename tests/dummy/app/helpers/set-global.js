import { helper } from '@ember/component/helper';
import { info } from 'documents/util/logger';

export default helper((params, hash) => {
  for(let key in hash) {
    let value = hash[key];
    if(value) {
      window[key] = value;
      info(`set-global: ${key} = ${value}`);
    }
  }
});
