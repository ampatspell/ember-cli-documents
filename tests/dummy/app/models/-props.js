import { find, prop } from 'documents';

export const findByType = ({ type }) => {
  type = prop.wrap(type);
  return find({
    owner: [ type.key() ],
    document: [ 'type' ],
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

export const viewByKey = ({ database, ddoc, view, key, value }) => {
  value = prop.wrap(value);
  return find({
    database,
    owner: [ value.key() ],
    document: [ key ],
    query(owner) {
      let value_ = value.value(owner);
      if(!value_) {
        return;
      }
      return { ddoc, view, key: value_ };
    },
    matches(doc, owner) {
      let value_ = value.value(owner);
      if(!value_) {
        return;
      }
      return doc.get(key) === value_;
    }
  });
};
