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
  writeDeck: (filename, data) => {
    const { projectFolder, resourcesFolder } = getFolders(filename);

    if (!fs.existsSync(projectFolder))
      fs.promises.mkdir(projectFolder, { recursive: true });

    fs.writeFileSync(filename, JSON.stringify(data));
  },
  writeResources: (filename, resources) => {
    const { projectFolder, resourcesFolder } = getFolders(filename);

    if (!fs.existsSync(resourcesFolder))
      fs.promises.mkdir(resourcesFolder, { recursive: true });

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
