import Model from './-base';
import { byType } from '../../-props';

const type = 'blog';

export default Model.extend({

  type,

  docs: byType({ type })

});
