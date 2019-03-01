const { remote, ipcRenderer } = window.require('electron');
const { dialog } = remote;
const fs = remote.require('fs');

const cleanDeck = ({filename, cards, ...data}) => ({
  ...data,
  cards: cards.map(({original, ...card}) => card)
});

class DeckStorage {

  static read(filename) {
    return JSON.parse(fs.readFileSync(filename));
  }

  static write(filename, data) {
    fs.writeFileSync(filename, JSON.stringify(data));
  }

  static open(filename) {
    const loadDeck = (filename) => ({ ...DeckStorage.read(filename), filename });

    if (filename)
      return DeckStorage.onOpen(loadDeck(filename));
    return new Promise((resolve, reject) => dialog.showOpenDialog((filenames) => {
      if (!filenames || !filenames.length) {
        resolve(null);
        return;
      }

      let content = loadDeck(filenames[0]);
      resolve(content);
    }));
  }

  static save() {
    const {filename, ...data} = DeckStorage.onSave();
    if (!filename)
      return DeckStorage.saveAs();

    DeckStorage.write(filename, cleanDeck(data));
    return filename;
  }

  static saveAs(newFilename) {
    if (newFilename) {
      DeckStorage.write(newFilename, cleanDeck(DeckStorage.onSave()));
      return newFilename;
    }

    return new Promise((resolve, reject) => dialog.showSaveDialog((newFilename) => {
      if (!newFilename) {
        resolve(null);
        return;
      }

      DeckStorage.write(newFilename, cleanDeck(DeckStorage.onSave()));
      resolve(newFilename);
    }));
  }

  static registerListeners({onOpen, onSave, updateFilename}) {
    const register = (name, callback) => {
      let eventName = name + '-event';
      ipcRenderer.on(eventName, async (event, ...args) => {
        console.log(`${name} event received`);
        event.sender.send(eventName + '-reply', await callback(event, ...args));
      });
    };


    DeckStorage.onOpen = onOpen;
    DeckStorage.onSave = onSave;
    register('open', async () => {
      const deck = await DeckStorage.open();
      if (deck)
        onOpen(deck)
    });
    register('save', async (e, ...args) => updateFilename(await DeckStorage.save()));
    register('saveAs', async (e, ...args) => updateFilename(await DeckStorage.saveAs()));
  }
}

export default DeckStorage;
