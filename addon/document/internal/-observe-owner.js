export default Class => class ObserveOwnerMixin extends Class {

  // _ownerValueForKeyDidChange

  _withOwnerObserving(cb) {
    let owner = this.owner;
    if(!owner) {
      return;
    }
    let keys = this.opts.owner;
    if(keys.length === 0) {
      return;
    }
    keys.forEach(key => cb(owner, key));
  }

  _startObservingOwner() {
    this._withOwnerObserving((owner, key) => {
      owner.addObserver(key, this, this._ownerValueForKeyDidChange);
    });
  }

  _stopObservingOwner() {
    this._withOwnerObserving((owner, key) => {
      owner.removeObserver(key, this, this._ownerValueForKeyDidChange);
    });
  }

}
