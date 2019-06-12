class Wrapper {

  static init() {
    const backendName = window.require ? 'electron' : 'web';
    const backend = require(`./wrappers/${backendName}`).default;

    Object.getOwnPropertyNames(Wrapper).forEach(key => {
      if (typeof Wrapper[key] !== 'function')
        return;

      if (!backend[key])
        console.error(`Wrapper.${key} isn't implemented for ${backendName} backend`);
      else
        Wrapper[key] = backend[key];
    });

    backend.init();
    backend.send('ready');
  }

  static on(event, callback) {
    throw new Error('Not implemented');
  }

  static once(event, callback) {
    throw new Error('Not implemented');
  }

  static off(event, callback) {
    throw new Error('Not implemented');
  }

  static send(event, payload) {
    throw new Error('Not implemented');
  }

  static readDeck(filename) {
    throw new Error('Not implemented');
  }

  static getResourcesPath(filename, path) {
    throw new Error('Not implemented');
  }

  static writeDeck(filename, data) {
    throw new Error('Not implemented');
  }

  static writeResources(filename, resources) {
    throw new Error('Not implemented');
  }

  static openFile(opts) {
    throw new Error('Not implemented');
  }

  static saveFile(opts) {
    throw new Error('Not implemented');
  }

  static openUrl(url) {
    throw new Error('Not implemented');
  }
};

export default Wrapper;
