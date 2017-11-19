import EmberObject from '@ember/object';
import { run } from '@ember/runloop';
import module from '../helpers/module-for-db';
import { test } from '../helpers/qunit';
import { Model, model } from 'documents';

const Post = Model.extend({});
const TextPost = Post.extend({});
const LinkPost = Post.extend({});

const postModel = opts => model({
  owner: [ `${opts.doc}.type` ],
  type(owner) {
    let type = owner.get(`${opts.doc}.type`);
    if(!type) {
      return;
    }
    type = type.split(':')[1];
    let mapping = {
      text: 'text-post',
      link: 'link-post'
    };
    return mapping[type];
  },
  create(owner) {
    let doc = owner.get(opts.doc);
    if(!doc) {
      return;
    }
    return { doc };
  }
});

module('computed-model-type', {
  beforeEach() {
    this.register('model:text-post', TextPost);
    this.register('model:link-post', LinkPost);
    this.create = (opts={}) => {
      let Subject = EmberObject.extend({
        doc: opts.doc,
        prop: postModel({ doc: 'doc' })
      });
      return Subject.create({ store: this.store, database: this.db });
    };
  }
});

test('create', function(assert) {
  let subject = this.create({ doc: { type: 'post:text' }});
  let prop = subject.get('prop');
  assert.ok(prop);
  assert.ok(TextPost.detectInstance(prop));
});

test('create and set doc.type afterwards', function(assert) {
  let doc = EmberObject.create();
  let subject = this.create({ doc });
  assert.ok(!subject.get('prop'));

  doc.set('type', 'post:text');
  let first = subject.get('prop');

  assert.ok(TextPost.detectInstance(first));

  doc.set('type', 'post:link');
  let second = run(() => subject.get('prop'));

  assert.ok(LinkPost.detectInstance(second));

  assert.ok(first !== second);
  assert.ok(first._internal !== second);

  assert.ok(first.isDestroyed);
  assert.ok(!second.isDestroyed);
});

test('create without doc', function(assert) {
  let subject = this.create();
  let prop = subject.get('prop');
  assert.ok(!prop);
});
