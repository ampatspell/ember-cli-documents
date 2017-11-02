import Ember from 'ember';
import { Model } from 'documents';
import { byType } from '../-props';

const {
  RSVP: { all }
} = Ember;

export default Model.extend({

  blogs: byType({ type: 'blog' }),

  async _insertBlogs() {
    let db = this.get('database');
    await all([
      { id: 'blog:ducks', type: 'blog', title: 'Ducks Blog' },
      { id: 'blog:amateurinmotion', type: 'blog', title: 'amateurinmotion' }
    ].map(props => db.doc(props).save()));
  },

  async load() {
    let blogs = await this.get('blogs').load();
    if(blogs.get('length') === 0) {
      await this._insertBlogs();
    }
    return this;
  }

});
