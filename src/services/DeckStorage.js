const { remote, ipcRenderer } = window.require('electron');
const { dialog } = remote;
const fs = remote.require('fs');

class DeckStorage {

  static save(data) {
    return new Promise((resolve, reject) => dialog.showSaveDialog((filename) => {
      fs.writeFileSync(filename, JSON.stringify(data));
      resolve(filename);
    }));
  }

  static open() {
    return new Promise((resolve, reject) => dialog.showOpenDialog((filenames) => {
      if (!filenames || !filenames.length)
        reject('No file selected');

      let filename  = filenames[0];
      let content   = JSON.parse(fs.readFileSync(filename));
      resolve(content);
    }));
  }

  static registerListeners() {
    const register = (name, callback) => {
      let eventName = name + '-event';
      ipcRenderer.on(eventName, async (event, ...args) => {
        console.log(`${name} event received`);
        event.sender.send(eventName + '-reply', await callback(event, ...args));
      });
    };

    register('open', (e, ...args) => 'openResponse');
    register('save', (e, ...args) => 'saveResponse');
    register('saveAs', (e, ...args) => 'saveAsResponse');
  }
}

export default DeckStorage;
