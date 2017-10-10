import Ember from 'ember';
import DocumentsError from '../util/error';
import Operation from './-operation';

const {
  A,
  merge,
  copy,
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

  __scheduleDatabaseOperation(label, opts, fn, before, resolve) {
    opts = merge({}, opts);
    let op = new Operation(label, { opts }, fn, before, resolve);
    this._registerDatabaseOperation(op);
    op.invoke();
    return op;
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

  _scheduleDocumentFindOperation(opts, before, resolve) {
    opts = normalizeOpts(opts, {});

    let original = copy(opts, true);

    let id = opts.id;
    let all = opts.all;
    let ddoc = opts.ddoc;
    let view = opts.view;
    let selector = opts.selector;

    let force = opts.force;
    delete opts.force;

    const schedule = (label, fn) => this.__scheduleDatabaseOperation(label, original, fn, before, resolve);

    if(id) {
      let internal = this._existingInternalDocument(id, { deleted: true });
      if(internal) {
        return this._scheduleInternalLoad(internal, { force }, before, internal => {
          let hash = result('single', internal);
          if(resolve) {
            return resolve(hash);
          }
          return hash;
        });
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

    return schedule('error', () => reject(new DocumentsError({
      error: 'invalid_query',
      reason: 'opts must include { all: true }, { id }, { ddoc, view } or { selector }'
    })));
  },

  _scheduleDocumentFirstOperation(opts, before, resolve) {
    opts = normalizeOpts(opts, { limit: 1 });
    return this._scheduleDocumentFindOperation(opts, before, ({ result, type }) => {
      let internal;
      if(type === 'single') {
        internal = result;
      } else {
        internal = result[0];
      }
      if(!internal) {
        return reject(new DocumentsError({ error: 'not_found', reason: 'missing', status: 404 }));
      }
      if(resolve) {
        return resolve(internal);
      }
      return internal;
    });
  },

  _scheduleDocumentOperation(opts, type, before, resolve) {
    if(type === 'first') {
      return this._scheduleDocumentFirstOperation(opts, before, resolve);
    } else if(type === 'find') {
      return this._scheduleDocumentFindOperation(opts, before, resolve);
    } else {
      return reject(new DocumentsError({ error: 'internal', reason: `type must be 'first' or 'find' not ${type}` }));
    }
  },

  _internalDocumentFind(opts) {
    return this._scheduleDocumentFindOperation(opts).promise;
  },

  _internalDocumentFirst(opts) {
    return this._scheduleDocumentFirstOperation(opts).promise;
  }

});
