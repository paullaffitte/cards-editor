import DeckActions from '../state/actions/deck';
import { runMigrations } from './DeckMigration';
import semver from 'semver'

const { remote, ipcRenderer } = window.require('electron');
const { dialog } = remote;
const fs = remote.require('fs');
const path = remote.require('path');

const cleanList = ({original, updated, ...item}) => item;

const cleanResources = resources => {
  const cleanResources = {};
  for (let id in resources) {
    const { path } = resources[id];
    cleanResources[id] = path;
  }
  return cleanResources;
};

const cleanDeck = ({filename, openAt, updated, cards, effects, resources, ...data}) => ({
  ...data,
  cards: cards.map(cleanList),
  effects: effects.map(cleanList),
  resources: cleanResources(resources)
});

let pdfPromise = null;

const registerListener = (name, callback) => {
  ipcRenderer.on(name, async (event, ...args) => {
    console.log(`${name} event received`);
    await callback(event, ...args);
  });
};

const handleVersions = deck => {
  const appVersion = window.appVersion;

  if (!deck.version)
    deck.version = '0.0.0';

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

const unpackDeck = deck => {
  const resources = {};

  for (let id in deck.resources) {
    const path = deck.resources[id];
    resources[id] = {
      id: id,
      path: path,
      src: 'file://' + path
    };
  }

  return { ...deck, resources };
}

class DeckStorage {

  static read(filename) {
    const content = JSON.parse(fs.readFileSync(filename));
    const packedDeck = handleVersions({ ...content, filename, openAt: Date.now() });

    return packedDeck ? unpackDeck(packedDeck) : null;
  }

  static write(filename, data) {
    const projectFolder = path.dirname(filename);
    const resourcesFolder = projectFolder + '/resources';

    if (!fs.existsSync(projectFolder))
      fs.promises.mkdir(projectFolder, { recursive: true });

    if (!fs.existsSync(resourcesFolder))
      fs.promises.mkdir(resourcesFolder);

    fs.writeFileSync(filename, JSON.stringify(cleanDeck(data)));
  }

  static open(filename) {
    const loadDeck = (filename) => {
      const deck = DeckStorage.read(filename);
      return deck ? deck : null;
    }

    if (filename) {
      DeckStorage.onOpen(loadDeck(filename));
      return;
    }
    return new Promise((resolve, reject) => dialog.showOpenDialog({
      title: 'Open',
      properties: [ 'openFile' ],
      filters: [
        { name: 'Deck', extensions: ['deck', 'json'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    }, (filenames) => {
      if (!filenames || !filenames.length) {
        resolve(null);
        return;
      }

      const filename = filenames[0];
      resolve(loadDeck(filename));
    }));
  }

  static save() {
    const { filename, ...data } = DeckStorage.onSave();
    if (!filename)
      return DeckStorage.saveAs();

    DeckStorage.write(filename, data);
    return filename;
  }

  static saveAs(newFolder) {
    const folderToFilename = folder => folder + '/deck.json';

    if (newFolder) {
      DeckStorage.write(newFolder, DeckStorage.onSave());
      return folderToFilename(newFolder);
    }

    return new Promise((resolve, reject) => dialog.showOpenDialog({
      title: 'Save in a folder',
      properties: [ 'openDirectory' ]
    }, (newFolder) => {
      if (!newFolder) {
        resolve(null);
        return;
      }

      const filename = folderToFilename(newFolder[0]);
      DeckStorage.write(filename, DeckStorage.onSave());
      resolve(filename);
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
