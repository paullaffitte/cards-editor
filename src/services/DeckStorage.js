const { remote, ipcRenderer } = window.require('electron');
const { dialog } = remote;
const fs = remote.require('fs');

class DeckStorage {

  static read(filename) {
    return JSON.parse(fs.readFileSync(filename));
  }

  static write(filename, data) {
    fs.writeFileSync(filename, JSON.stringify(data));
  }

  static open(filename) {
    if (filename)
      return DeckStorage.onOpen(DeckStorage.read(filename));
    return new Promise((resolve, reject) => dialog.showOpenDialog((filenames) => {
      if (!filenames || !filenames.length) {
        resolve(null);
        return;
      }

      let content = DeckStorage.read(filenames[0]);
      resolve(content);
    }));
  }

  static save(data) {
    return DeckStorage.saveAs(data);
  }

  static saveAs(data, filename) {
    if (filename) {
      DeckStorage.write(filename, data);
      return filename;
    }

    return new Promise((resolve, reject) => dialog.showSaveDialog((filename) => {
      DeckStorage.write(filename, data);
      resolve(filename);
    }));
  }

  static registerListeners({onOpen, onSave}) {
    const register = (name, callback) => {
      let eventName = name + '-event';
      ipcRenderer.on(eventName, async (event, ...args) => {
        console.log(`${name} event received`);
        event.sender.send(eventName + '-reply', await callback(event, ...args));
      });
    };


    DeckStorage.onOpen = onOpen;
    DeckStorage.open('./deck.json'); // TODO remove this line
    register('open', async () => {
      const deck = await DeckStorage.open();
      if (deck)
        onOpen(deck)
    });
    register('save', (e, ...args) => DeckStorage.save(onSave()));
    register('saveAs', (e, ...args) => DeckStorage.save(onSave()));
  }
}

export default DeckStorage;
