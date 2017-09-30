import Content, { property } from './-base';

const contentType = property('contentType');
const value = property('value');

export default Content.extend({

  contentType: contentType(),
  value: value()

});
