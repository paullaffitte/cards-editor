import DeckActions from '../state/actions/deck';
import { runMigrations } from './DeckMigration';
import semver from 'semver'

const { remote, ipcRenderer } = window.require('electron');
const { app, dialog } = remote;
const fs = remote.require('fs');

const cleanList = ({original, updated, ...item}) => item;

const cleanDeck = ({filename, updated, cards, effects, ...data}) => ({
  ...data,
  cards: cards.map(cleanList),
  effects: effects.map(cleanList)
});

let pdfPromise = null;

const deckFileFilters = [
  { name: 'Deck', extensions: ['deck', 'json'] },
  { name: 'All Files', extensions: ['*'] }
];

const registerListener = (name, callback) => {
  ipcRenderer.on(name, async (event, ...args) => {
    console.log(`${name} event received`);
    await callback(event, ...args);
  });
};

const handleVersions = deck => {
  const appVersion = app.getVersion();

  if (!semver.valid(deck.version)) {
    alert(`Invalid deck version "${deck.version}"`);
    return null;
  }

  if (semver.lt(deck.version, appVersion)) {
    return runMigrations(deck, appVersion);
  } else if (semver.gt(deck.version, appVersion)) {
    alert(`Your software is outdated (${appVersion}) and thus can't open this deck (${deck.version}).`);
    return null;
  }

  return deck;
}

class DeckStorage {

  static read(filename) {
    return handleVersions(JSON.parse(fs.readFileSync(filename)));
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

      const filename = filenames[0];
      const deck = DeckStorage.read(filename);
      resolve(deck ? { ...deck, filename } : null);
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

  static initFonts(store) {
    ipcRenderer.removeAllListeners('availableFonts');
    ipcRenderer.on('availableFonts', (e, fonts) => store.dispatch(DeckActions.updateAvailableFonts(fonts)));
    ipcRenderer.send('getAvailableFonts');
  }

  static onQuit(callback) {
    registerListener('quit', () => {
      callback(() => ipcRenderer.send('quit'));
    });
  }

  static registerListeners({onNew, onOpen, onSave, onExport, updateFilename}) {

    DeckStorage.onOpen = onOpen;
    DeckStorage.onSave = onSave;

    ipcRenderer.removeAllListeners('new');
    ipcRenderer.removeAllListeners('open');
    ipcRenderer.removeAllListeners('save');
    ipcRenderer.removeAllListeners('saveAs');
    ipcRenderer.removeAllListeners('exportAsPDF');
    ipcRenderer.removeAllListeners('exportAsPDF-reply');

    registerListener('new', onNew);
    registerListener('open', async () => {
      const deck = await DeckStorage.open();
      if (deck)
        onOpen(deck)
    });
    registerListener('save', async (e, ...args) => updateFilename(await DeckStorage.save()));
    registerListener('saveAs', async (e, ...args) => updateFilename(await DeckStorage.saveAs()));
    registerListener('exportAsPDF', onExport);
    registerListener('exportAsPDF-reply', (e, response) => {
      if ( !pdfPromise )
        return;

      response.err ? pdfPromise.reject(response.err) : pdfPromise.resolve(response.data);
      pdfPromise = null;
    });
  }
}

export default DeckStorage;
