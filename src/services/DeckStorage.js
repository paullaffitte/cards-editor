const { remote, ipcRenderer } = window.require('electron');
const { dialog } = remote;
const fs = remote.require('fs');

const cleanList = ({original, updated, ...item}) => item;

const cleanDeck = ({filename, cards, effects, ...data}) => ({
  ...data,
  cards: cards.map(cleanList),
  effects: effects.map(cleanList)
});

let pdfPromise = null;

const deckFileFilters = [
  { name: 'Deck', extensions: ['deck', 'json'] },
  { name: 'All Files', extensions: ['*'] }
];

class DeckStorage {

  static read(filename) {
    return JSON.parse(fs.readFileSync(filename));
  }

  static write(filename, data) {
    fs.writeFileSync(filename, JSON.stringify(cleanDeck(data)));
  }

  static open(filename) {
    const loadDeck = (filename) => ({ ...DeckStorage.read(filename), filename });

    if (filename)
      return DeckStorage.onOpen(loadDeck(filename));
    return new Promise((resolve, reject) => dialog.showOpenDialog({
      title: 'Open',
      filters: deckFileFilters
    }, (filenames) => {
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

    DeckStorage.write(filename, data);
    return filename;
  }

  static saveAs(newFilename) {
    if (newFilename) {
      DeckStorage.write(newFilename, DeckStorage.onSave());
      return newFilename;
    }

    return new Promise((resolve, reject) => dialog.showSaveDialog({
      title: 'Save',
      filters: deckFileFilters
    }, (newFilename) => {
      if (!newFilename) {
        resolve(null);
        return;
      }

      DeckStorage.write(newFilename, DeckStorage.onSave());
      resolve(newFilename);
    }));
  }

  static exportAsPDF() {
    return new Promise(async (resolve, reject) => dialog.showSaveDialog({
      title: 'Export',
      defaultPath: './deck.pdf',
      filters: [
        { name: 'PDF', extensions: ['pdf'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    }, (filename) => {
      if (!filename) {
        resolve(null);
        return;
      }

      pdfPromise = { resolve, reject };
      ipcRenderer.send('exportAsPDF', filename);
    }));
  }

  static registerListeners({onNew, onOpen, onSave, onExport, updateFilename}) {
    const register = (name, callback) => {
      ipcRenderer.on(name, async (event, ...args) => {
        console.log(`${name} event received`);
        await callback(event, ...args);
      });
    };

    DeckStorage.onOpen = onOpen;
    DeckStorage.onSave = onSave;

    ipcRenderer.removeAllListeners('new');
    ipcRenderer.removeAllListeners('open');
    ipcRenderer.removeAllListeners('save');
    ipcRenderer.removeAllListeners('saveAs');
    ipcRenderer.removeAllListeners('exportAsPDF');
    ipcRenderer.removeAllListeners('exportAsPDF-reply');

    register('new', onNew);
    register('open', async () => {
      const deck = await DeckStorage.open();
      if (deck)
        onOpen(deck)
    });
    register('save', async (e, ...args) => updateFilename(await DeckStorage.save()));
    register('saveAs', async (e, ...args) => updateFilename(await DeckStorage.saveAs()));
    register('exportAsPDF', onExport);
    register('exportAsPDF-reply', (e, response) => {
      if ( !pdfPromise )
        return;

      response.err ? pdfPromise.reject(response.err) : pdfPromise.resolve(response.data);
      pdfPromise = null;
    });
  }
}

export default DeckStorage;
