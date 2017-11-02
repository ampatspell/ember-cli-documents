import Model from './-base';
import { byType } from '../../-props';

export default Model.extend({

  docs: byType({ type: 'author' })

});
