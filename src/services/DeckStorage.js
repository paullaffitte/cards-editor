import Wrapper from '../services/Wrapper';
import DeckActions from '../state/actions/deck';
import { runMigrations } from './DeckMigration';
import semver from 'semver'

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
  Wrapper.on(name, async (event, ...args) => {
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
    const content = Wrapper.readDeck(filename);
    const packedDeck = handleVersions({ ...content, filename, openAt: Date.now() });

    return packedDeck ? unpackDeck(packedDeck) : null;
  }

  static write(filename, data) {
    return Wrapper.writeDeck(filename, cleanDeck(data));
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

    return Wrapper.openFile({
      title: 'Open',
      properties: [ 'openFile' ],
      filters: [
        { name: 'Deck', extensions: ['deck', 'json'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    }).then(loadDeck);
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

    return Wrapper.openFile({
      title: 'Save in a folder',
      properties: [ 'openDirectory' ]
    }).then(folder => {
      const filename = folderToFilename(folder);
      DeckStorage.write(filename, DeckStorage.onSave());
      return filename;
    });
  }

  static exportAsPDF() {
    return new Promise((resolve, reject) => Wrapper.saveFile({
      title: 'Export',
      defaultPath: './deck.pdf',
      filters: [
        { name: 'PDF', extensions: ['pdf'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    }).then(filename => {
      pdfPromise = { resolve, reject };
      Wrapper.send('exportAsPDF', filename);
    }));
  }

  static initFonts(store) {
    Wrapper.removeAllListeners('availableFonts');
    Wrapper.on('availableFonts', (e, fonts) => store.dispatch(DeckActions.updateAvailableFonts(fonts)));
    Wrapper.send('getAvailableFonts');
  }

  static onQuit(callback) {
    registerListener('quit', () => {
      callback(() => Wrapper.send('quit'));
    });
  }

  static registerListeners({onNew, onOpen, onSave, onExport, updateFilename}) {

    DeckStorage.onOpen = onOpen;
    DeckStorage.onSave = onSave;

    Wrapper.removeAllListeners('new');
    Wrapper.removeAllListeners('open');
    Wrapper.removeAllListeners('save');
    Wrapper.removeAllListeners('saveAs');
    Wrapper.removeAllListeners('exportAsPDF');
    Wrapper.removeAllListeners('exportAsPDF-reply');

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
