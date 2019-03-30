class MenuActions {

  static new(callback, ...args) {
    console.log('new callback success!');
  }

  static open(callback, ...args) {
    console.log('open callback success!');
  }

  static save(callback, ...args) {
    console.log('save callback success!');
  }

  static saveAs(callback, ...args) {
    console.log('saveAs callback success!');
  }

  static exportAsPDF(callback, ...args) {
    console.log('exportAsPdf callback success!');
  }
}

module.exports = MenuActions;
