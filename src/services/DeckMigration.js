import semver from 'semver';
import { notification, message } from 'antd';
import i18n from '../constants/i18n';
import Wrapper from './Wrapper';

const makeMigration = (version, migration) => ({
  version,
  migrate: deck => {
    message.info(i18n.t('migrations.messages.migratingDeck', { from: deck.version, to: version}));
    return { ...migration(deck), version };
  }
});

const migrations = [
  makeMigration('1.2.0', deck => {
    const { filename, ...newDeck } = deck;
    const projectFolder = filename.split('.').shift();

    newDeck.cards.forEach(card => {
      card.models = [ 'global' ];
    });

    newDeck.cards.push({
      ...newDeck.cardsConfig,
      id: 'global',
      name: 'global',
      type: 'minion'
    });

    delete newDeck.cardsConfig;

    newDeck.filename = projectFolder + '/deck.json';
    notification.warning({
      message: i18n.t('migrations.messages.oldDeckVersion'),
      description: i18n.t('migrations.messages.oldDeckVersionDescription', { projectFolder }),
      placement: 'bottomLeft',
      duration: 10
    });

    Object.keys(newDeck.resources).forEach(id => newDeck.resources[id] = { id, path: newDeck.resources[id] });
    let updates = Wrapper.writeResources(newDeck.filename, newDeck.resources);
    updates.forEach(({ id, path }) => newDeck.resources[id] = path.split('/').pop());

    return newDeck;
  }),
];

export function runMigrations(deck, target) {
  return migrations
    .sort((a, b) => semver.gt(a.version, b.version) ? 1 : semver.lt(a.version, b.version) ? -1 : 0)
    .filter(migration => semver.gt(migration.version, deck.version) && !semver.gt(migration.version, target))
    .reduce((acc, migration) => migration.migrate(acc), deck);
}
