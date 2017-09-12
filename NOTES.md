# Document and Object

``` javascript
author.set('address', { country: 'Latvia' });
author.set('permissions', [
  { id: 'blog:one', edit: true }
]);

author // Document
author.get('country') // DocumentObject
author.get('permissions') // DocumentArray
author.get('permissions.firstObject') // DocumentObject
```
