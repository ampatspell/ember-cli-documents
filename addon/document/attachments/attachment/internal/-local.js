import Content from './-base';

export default class LocalContent extends Content {

  shouldSerialize(type) {
    if(type === 'shoebox') {
      return false;
    }
    return true;
  }

}
