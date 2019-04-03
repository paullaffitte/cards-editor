import semver from 'semver'

const makeMigration = (version, migration) => ({
  version,
  migrate: deck => ({ ...migration(deck), version })
});

const migrations = [
  // makeMigration('1.0.1', deck => deck),
];


export function runMigrations(deck, target) {
  return migrations
    .sort((a, b) => semver.gt(a.version, b.version) ? 1 : semver.lt(a.version, b.version) ? -1 : 0)
    .filter(migration => semver.gt(migration.version, deck.version))
    .reduce((acc, migration) => migration.migrate(acc), deck);
}
