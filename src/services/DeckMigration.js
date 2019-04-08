import semver from 'semver'

const makeMigration = (version, migration) => ({
  version,
  migrate: deck => {
    console.log(`migrating deck from ${deck.version} to ${version}`);
    return { ...migration(deck), version };
  }
});

const migrations = [];

export function runMigrations(deck, target) {
  return migrations
    .sort((a, b) => semver.gt(a.version, b.version) ? 1 : semver.lt(a.version, b.version) ? -1 : 0)
    .filter(migration => semver.gt(migration.version, deck.version) && !semver.gt(migration.version, target))
    .reduce((acc, migration) => migration.migrate(acc), deck);
}
