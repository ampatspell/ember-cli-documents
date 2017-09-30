import Content from './-base';
import createLoader from 'couch/util/file-loader/create';

export default class StringContent extends Content {

  constructor(store, file) {
    super(store);
    this.file = file;
    this.loader = createLoader(file);
  }

  get type() {
    return 'file';
  }

  get contentType() {
    return this.loader.contentType;
  }

  serialize(type) {
    let { loader, file } = this;
    if(type === 'document') {
      return {
        data: loader
      };
    } else {
      return {
        type: this.type,
        content_type: loader.contentType,
        filename: file.name,
        size: loader.size
      };
    }
  }

}
