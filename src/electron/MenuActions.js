class MenuActions {

  static open(callback, ...args) {
    console.log('open callback success!');
  }

  static save(callback, ...args) {
    console.log('save callback success!');
  }

  static saveAs(callback, ...args) {
    console.log('saveAs callback success!');
  }
}

module.exports = MenuActions;
