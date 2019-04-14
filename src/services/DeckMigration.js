import semver from 'semver';
import { notification } from 'antd';

const makeMigration = (version, migration) => ({
  version,
  migrate: deck => {
    console.log(`migrating deck from ${deck.version} to ${version}`);
    return { ...migration(deck), version };
  }
});

const migrations = [
  makeMigration('1.2.0', deck => {
    const { filename, ...newDeck } = deck;
    notification.warning({
      message: 'Deck from an old version',
      description: 'This deck is from an older version than your software. This version now save projects in folders instead of plain files, thus a new project location will be asked at next save.',
      placement: 'bottomLeft',
      duration: 10
    });
    return newDeck;
  }),
];

export function runMigrations(deck, target) {
  return migrations
    .sort((a, b) => semver.gt(a.version, b.version) ? 1 : semver.lt(a.version, b.version) ? -1 : 0)
    .filter(migration => semver.gt(migration.version, deck.version) && !semver.gt(migration.version, target))
    .reduce((acc, migration) => migration.migrate(acc), deck);
}
