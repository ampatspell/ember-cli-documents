import Ember from 'ember';
import DocumentsError from '../util/error';

const {
  A,
  merge,
  RSVP: { reject }
} = Ember;

const normalizeOpts = (opts, defaults) => {
  if(typeof opts === 'string') {
    opts = { id: opts };
  }
  return merge(defaults, opts);
};

const result = type => result => ({ type, result });

const view = fn => function(...args) {
  let opts = args.pop();
  opts = merge({ include_docs: true }, opts);
  args.push(opts);
  args.unshift(this.get('documents'));
  return fn.call(this, ...args).then(json => {
    let docs = A(json.rows).map(row => row.doc);
    return this._deserializeDocuments(docs);
  });
};

const doc = fn => function(...args) {
  args.unshift(this.get('documents'));
  return fn.call(this, ...args).then(doc => this._deserializeDocument(doc));
};

export default Ember.Mixin.create({

  __loadInternalDocumentById: doc(function(documents, id, opts) {
    return documents.load(id, opts);
  }),

  _loadInternalDocumentById(id, opts) {
    let internal = this._existingInternalDocument(id, { deleted: true });
    if(internal) {
      return internal.scheduleLoad();
    }
    return this.__loadInternalDocumentById(id, opts);
  },

  _loadInternalDocumentsAll: view(function(documents, opts) {
    return documents.all(opts);
  }),

  _loadInternalDocumentsView: view(function(documents, ddoc, view, opts) {
    return documents.view(ddoc, view, opts);
  }),

  _loadInternalDocumentsMango(opts) {
    return this.get('documents.mango').find(opts).then(json => this._deserializeDocuments(json.docs));
  },

  _internalDocumentFind(opts) {
    opts = normalizeOpts(opts, {});

    let id = opts.id;
    let all = opts.all;
    let ddoc = opts.ddoc;
    let view = opts.view;
    let selector = opts.selector;

    if(id) {
      return this._loadInternalDocumentById(id, opts).then(result('single'));
    } else if(all) {
      delete opts.all;
      return this._loadInternalDocumentsAll(opts).then(result('array'));
    } else if(ddoc && view) {
      delete opts.ddoc;
      delete opts.view;
      return this._loadInternalDocumentsView(ddoc, view, opts).then(result('array'));
    } else if(selector) {
      return this._loadInternalDocumentsMango(opts).then(result('array'));
    }

    return reject(new DocumentsError({
      error: 'invalid_query',
      reason: 'opts must include { all: true }, { id }, { ddoc, view } or { selector }'
    }));
  },

  _internalDocumentFirst(opts) {
    opts = normalizeOpts(opts, { limit: 1 });
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
