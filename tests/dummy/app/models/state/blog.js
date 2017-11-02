import { Model } from 'documents';
import { byType } from '../-props';
import { all, hash } from 'rsvp';
import { blog } from '../-model';

export default Model.extend({

  authors: blog({ type: 'state/blog/authors' }),
  blogs:   blog({ type: 'state/blog/blogs' }),

  async _rebuildDummyData() {
    let db = this.get('database');

    await all([
      all(this.get('blogs').map(doc => doc.delete())),
      all(this.get('authors').map(doc => doc.delete()))
    ]);

    await all([
      { id: 'blog:ducks', type: 'blog', title: 'Ducks Blog', owner: 'author:duck' },
      { id: 'blog:amateurinmotion', type: 'blog', title: 'amateurinmotion', owner: 'author:ampatspell' },
      { id: 'author:duck', type: 'author', name: 'Duck', email: 'ducky@gmail.com' },
      { id: 'author:ampatspell', type: 'author', name: 'ampatspell', email: 'ampatspell@gmail.com' }
    ].map(props => db.doc(props).save()));
  },

  async load() {
    let { blogs, authors } = await hash({
      blogs: this.get('blogs').load(),
      authors: this.get('authors').load()
    });

    if(blogs.get('isEmpty') || authors.get('isEmpty')) {
      await this._rebuildDummyData();
    }

    return this;
  }

});
