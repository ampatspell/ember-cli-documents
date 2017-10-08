import createTransform from './create-array-transform-mixin';
import DocumentsError from './error';

export default createTransform({
  internal() {
    throw new DocumentsError({ error: 'internal', reason: 'database.identity is immutable' });
  },
  public(internal) {
    return internal && internal.model(true);
  }
});
