const { remote, ipcRenderer } = window.require('electron');
const { dialog } = remote;
const fs = remote.require('fs');
const dirname = remote.require('path').dirname;
const { shell } = window.require('electron');

const getFolders = (filename) => {
  const projectFolder = dirname(filename);
  return {
    projectFolder,
    resourcesFolder: projectFolder + '/resources'
  }
};

function mkdirSyncRecursivePatched(path) {
  const parent = path.split('/').slice(0, -1).join('/');

  if (!fs.existsSync(parent))
    mkdirSyncRecursivePatched(parent);
  fs.mkdirSync(path);
}

export default {
  init: () => {
    window.appVersion = remote.app.getVersion();
    window.isDev = remote.require('electron-is-dev');

    ipcRenderer.send('getAvailableFonts');
  },
  on: (event, callback) => ipcRenderer.on(event, callback),
  once: (event, callback) => ipcRenderer.once(event, callback),
  off: (event, callback) => ipcRenderer.removeListener(event, callback),
  send: (event, payload) => ipcRenderer.send(event, payload),
  readDeck: (filename) => {
    return JSON.parse(fs.readFileSync(filename));
  },
  getResourcesPath: (filename, path) => {
    const { resourcesFolder } = getFolders(filename);
    return resourcesFolder + '/' + path;
  },
  writeDeck: (filename, deck) => {
    const { projectFolder, resourcesFolder } = getFolders(filename);

    if (!fs.existsSync(projectFolder))
      mkdirSyncRecursivePatched(projectFolder);

    Object.keys(deck.resources).forEach(id => {
      const path = deck.resources[id];
      deck.resources[id] = path.slice(resourcesFolder.length + 1);
    });

    fs.writeFileSync(filename, JSON.stringify(deck));
  },
  writeResources: (filename, resources) => {
    const { resourcesFolder } = getFolders(filename);

    if (!fs.existsSync(resourcesFolder))
      mkdirSyncRecursivePatched(resourcesFolder);

    return Object.keys(resources).map(id => {
      const { path, ...resource } = resources[id];
      const resFolder = dirname(path);

      if (resFolder.indexOf(resourcesFolder) === 0)
        return null;

      let destination = resourcesFolder + '/' + path.split('/').pop();
      if (fs.existsSync(destination)) {
        destination = destination.split('.');
        const extension = destination.pop();
        destination = `${destination.join('.')}_${Date.now()}.${extension}`;
      }

      fs.copyFileSync(path, destination);
      resources[id] = destination;
      return { ...resource, path: destination };
    }).filter(Boolean);
  },
  openFile: (opts) => {
    return new Promise((resolve, reject) => dialog.showOpenDialog(opts, (filenames) => {
      if (!filenames || !filenames.length) {
        resolve(null);
        return;
      }

      if (opts.properties.includes('openDirectory') && opts.shouldBeEmpty) {
        const folderFiles = fs.readdirSync(filenames[0]);
        if (folderFiles.length)
          resolve({ error: 'This directory is not empty. You can only save your deck in an empty folder.' });
      }

      resolve(filenames[0]);
    }));
  },
  saveFile: (opts) => {
    return new Promise(async (resolve, reject) => dialog.showSaveDialog(opts, (filename) => {
      if (!filename) {
        resolve(null);
        return;
      }

      resolve(filename);
    }));
  },
  openUrl: shell.openExternal
};
