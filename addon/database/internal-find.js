import Ember from 'ember';
import DocumentsError from '../util/error';
import Operation from './-operation';

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

const view = fn => function(name, ...args) {
  let opts = args.pop();
  opts = merge({ include_docs: true }, opts);
  args.push(opts);
  args.unshift(this.get('documents'));
  return fn.call(this, ...args).then(json => {
    let docs = A(json.rows).map(row => row.doc);
    return this._deserializeDocuments(docs);
  }).then(result('array'));
};

const doc = fn => function(...args) {
  args.unshift(this.get('documents'));
  return fn.call(this, ...args).then(doc => this._deserializeDocument(doc)).then(result('single'));
};

export default Ember.Mixin.create({

  _scheduleDatabaseOperation(label, opts, fn) {
    opts = merge({}, opts);
    let op = new Operation(label, { opts }, fn);
    op.invoke();
    console.log('schedule', label, opts, op);
    return op.promise;
  },

  _loadInternalDocumentById: doc(function(documents, id, opts) {
    return documents.load(id, opts);
  }),

  _loadInternalDocumentsAll: view(function(documents, opts) {
    return documents.all(opts);
  }),

  _loadInternalDocumentsView: view(function(documents, ddoc, view, opts) {
    return documents.view(ddoc, view, opts);
  }),

  _loadInternalDocumentsMango(opts) {
    return this.get('documents.mango').find(opts)
      .then(json => this._deserializeDocuments(json.docs))
      .then(result('array'));
  },

  _internalDocumentFind(opts) {
    opts = normalizeOpts(opts, {});

    let id = opts.id;
    let all = opts.all;
    let ddoc = opts.ddoc;
    let view = opts.view;
    let selector = opts.selector;

    let schedule = (label, fn) => this._scheduleDatabaseOperation(label, opts, fn);

    if(id) {
      let internal = this._existingInternalDocument(id, { deleted: true });
      if(internal) {
        return internal.scheduleLoad().then(result('single'));
      }
      return schedule('id', () => {
        return this._loadInternalDocumentById(id, opts);
      });
    } else if(all) {
      return schedule('all', () => {
        delete opts.all;
        return this._loadInternalDocumentsAll(opts);
      });
    } else if(ddoc && view) {
      return schedule('view', () => {
        delete opts.ddoc;
        delete opts.view;
        return this._loadInternalDocumentsView(ddoc, view, opts);
      });
    } else if(selector) {
      return schedule('mango', () => {
        return this._loadInternalDocumentsMango(opts);
      });
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
        return reject(new DocumentsError({ error: 'not_found', reason: 'missing', status: 404 }));
      }
      return internal;
    });
  }

});
