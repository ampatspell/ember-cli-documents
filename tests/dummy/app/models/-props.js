import { find, prop } from 'documents';

export const findByType = ({ type }) => {
  type = prop.wrap(type);
  return find({
    owner: [ type.key() ],
    query(owner) {
      let key = type.value(owner);
      if(!key) {
        return;
      }
      return { ddoc: 'main', view: 'by-type', key };
    },
    matches(doc, owner) {
      return doc.get('type') === type.value(owner);
    }
  });
};
