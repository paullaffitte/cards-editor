import Wrapper from '../services/Wrapper';
import i18n from '../constants/i18n';
import { runMigrations } from './DeckMigration';
import semver from 'semver';
import { message } from 'antd';

const handleVersions = deck => {
  const appVersion = window.appVersion;

  if (!deck.version)
    deck.version = '0.0.0';

  if (!semver.valid(deck.version)) {
    alert(i18n.t('storage.messages.invalidDeckVersion', { version: deck.version }));
    return null;
  }

  if (semver.lt(deck.version, appVersion)) {
    return runMigrations(deck, appVersion);
  } else if (semver.gt(deck.version, appVersion)) {
    alert(i18n.t('storage.messages.updateRequired', { appVersion, deckVersion: deck.version }));
    return null;
  }

  return deck;
}

const unpackDeck = ({ filename, ...deck }) => {
  const resources = {};

  for (let id in deck.resources) {
    const path = Wrapper.getResourcesPath(filename, deck.resources[id]);
    resources[id] = {
      id: id,
      path: path,
      src: 'file://' + path
    };
  }

  return { ...deck, resources, filename };
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
    const loadDeck = (fname) => {
      if (!fname)
        return null;

      let deck;
      let error = i18n.t('storage.messages.unknownError');

      try {
        deck = DeckStorage.read(fname);
      } catch (e) {
        deck = null;
        error = e.message;
      }

      if (!deck) {
        message.error(i18n.t('storage.messages.couldNotOpenDeck', { error }));
        return null;
      }

      return deck;
    }

    if (filename) {
      return loadDeck(filename);
    }

    return Wrapper.openFile({
      title: i18n.t('storage.open'),
      properties: [ 'openFile' ],
      filters: [
        { name: 'Deck', extensions: ['deck', 'json'] },
        { name: i18n.t('storage.allFiles'), extensions: ['*'] }
      ]
    }).then(loadDeck);
  }

  static save({ filename }) {
    if (!filename)
      return DeckStorage.saveAs();

    DeckStorage.write(filename);
    return filename;
  }

  static async saveAs() {
    const filename = await Wrapper.openFile({
      title: i18n.t('storage.saveInFolder'),
      properties: [ 'openDirectory' ],
      shouldBeEmpty: true
    }).then(folder => {
      if (!folder)
        return null;

      const filename = folder + '/deck.json';

      DeckStorage.write(filename);
      return filename;
    });

    return filename;
  }

  static exportAsPDF() {
    return new Promise((resolve, reject) => Wrapper.saveFile({
      title: i18n.t('export.export'),
      defaultPath: './deck.pdf',
      filters: [
        { name: 'PDF', extensions: ['pdf'] },
        { name: i18n.t('storage.allFiles'), extensions: ['*'] }
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
