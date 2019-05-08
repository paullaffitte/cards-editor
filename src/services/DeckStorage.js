import Wrapper from '../services/Wrapper';
import { runMigrations } from './DeckMigration';
import semver from 'semver'

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

let actions = null;

class DeckStorage {

  static init(reduxActions) {
    actions = reduxActions;
  }

  static read(filename) {
    const content = Wrapper.readDeck(filename);
    const packedDeck = handleVersions({ ...content, filename, openAt: Date.now() });

    return packedDeck ? unpackDeck(packedDeck) : null;
  }

  static write(filename) {
    actions.writeDeck(filename);
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

  static save({ filename }) {
    if (!filename)
      return DeckStorage.saveAs({ filename });

    DeckStorage.write(filename);
    return filename;
  }

  static saveAs({ filename }) {
    return Wrapper.openFile({
      title: 'Save in a folder',
      properties: [ 'openDirectory' ]
    }).then(folder => {
      if (!folder)
        return null;

      const filename = folder + '/deck.json';

      DeckStorage.write(filename);
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
      if (!filename) {
        resolve(null);
        return;
      }

      Wrapper.once('exportAsPDF-reply', (e, response) => response.err
        ? reject(response.err)
        : resolve(filename));

      Wrapper.send('exportAsPDF', filename);
    }));
  }
}

export default DeckStorage;
