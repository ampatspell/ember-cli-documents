import Ember from 'ember';
import DocumentsError from '../util/error';
import Operation from './-operation';

const {
  on,
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

const result = (type, result) => ({ type, result });

const view = fn => function(...args) {
  let opts = args.pop();
  opts = merge({ include_docs: true }, opts);
  args.push(opts);
  args.unshift(this.get('documents'));
  return fn.call(this, ...args).then(json => {
    let docs = A(json.rows).map(row => row.doc);
    return result('array', this._deserializeDocuments(docs, 'document'));
  });
};

const doc = fn => function(...args) {
  args.unshift(this.get('documents'));
  return fn.call(this, ...args).then(json => result('single', this._deserializeDocument(json, 'document')));
};

export default Ember.Mixin.create({

  __createOperations: on('init', function() {
    this._operations = new A();
  }),

  __registerDatabaseOperation(operation) {
    let operations = this._operations;
    operations.pushObject(operation);
    operation.promise.catch(() => {}).finally(() => operations.removeObject(operation));
  },

  __scheduleDatabaseOperation(label, opts, fn) {
    opts = merge({}, opts);
    let op = new Operation(label, { opts }, fn);
    this.__registerDatabaseOperation(op);
    op.invoke();
    return op.promise;
  },

  __loadInternalDocumentById: doc(function(documents, id, opts) {
    return documents.load(id, opts);
  }),

  __loadInternalDocumentsAll: view(function(documents, opts) {
    return documents.all(opts);
  }),

  __loadInternalDocumentsView: view(function(documents, ddoc, view, opts) {
    return documents.view(ddoc, view, opts);
  }),

  __loadInternalDocumentsMango(opts) {
    return this.get('documents.mango').find(opts)
      .then(json => result('array', this._deserializeDocuments(json.docs, 'document')));
  },

  _internalDocumentFind(opts) {
    opts = normalizeOpts(opts, {});

    let id = opts.id;
    let all = opts.all;
    let ddoc = opts.ddoc;
    let view = opts.view;
    let selector = opts.selector;

    let schedule = (label, fn) => this.__scheduleDatabaseOperation(label, opts, fn);

    if(id) {
      let internal = this._existingInternalDocument(id, { deleted: true });
      if(internal) {
        return internal.scheduleLoad().then(() => result('single', internal));
      }
      return schedule('id', () => {
        delete opts.id;
        return this.__loadInternalDocumentById(id, opts);
      });
    } else if(all) {
      return schedule('all', () => {
        delete opts.all;
        return this.__loadInternalDocumentsAll(opts);
      });
    } else if(ddoc && view) {
      return schedule('view', () => {
        delete opts.ddoc;
        delete opts.view;
        return this.__loadInternalDocumentsView(ddoc, view, opts);
      });
    } else if(selector) {
      return schedule('mango', () => {
        return this.__loadInternalDocumentsMango(opts);
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
