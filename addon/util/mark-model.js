export const isDocumentModel = 'isDocumentModel';

export default Class => Class.reopenClass({
  [isDocumentModel]: true
});
