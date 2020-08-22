if (!Array.prototype.last) {
  Array.prototype.last = function () { // eslint-disable-line no-extend-native
    return this[this.length - 1];
  };
}
