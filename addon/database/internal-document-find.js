import Ember from 'ember';
import DocumentsError from '../util/error';

const {
  merge,
  RSVP: { reject }
} = Ember;

const result = type => result => ({ type, result });

export default Ember.Mixin.create({

  _loadInternalDocumentById(id, opts) {
    let internal = this._existingInternalDocument(id, { deleted: true });
    if(internal) {
      return internal.scheduleLoad();
    }
    return this.get('documents').load(id, opts).then(doc => this._deserializeDocument(doc));
  },

  _internalDocumentFind(opts) {
    if(typeof opts === 'string') {
      opts = { id: opts };
    }

    opts = merge({}, opts);

    let id = opts.id;

    if(id) {
      return this._loadInternalDocumentById(id, opts).then(result('single'));
    }

    return reject(new Error({
      error: 'invalid_query',
      reason: 'opts must include id'
    }));
  },

  _internalDocumentFirst(opts) {
    opts = merge({ limit: 1 }, opts);
    return this._internalDocumentFind(opts).then(({ result, type }) => {
      if(type === 'single') {
        return result;
      }
      return result[0];
    }).then(internal => {
      if(!internal) {
        return reject(new DocumentsError({ error: 'not_found', reason: 'missing' }));
      }
      return internal;
    });
  }

});
