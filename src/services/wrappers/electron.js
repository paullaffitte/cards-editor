const { remote, ipcRenderer } = window.require('electron');
const { dialog } = remote;
const fs = remote.require('fs');
const path = remote.require('path');
const { shell } = window.require('electron');

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
    const projectFolder = path.dirname(filename);
    const resourcesFolder = projectFolder + '/resources';

    if (!fs.existsSync(projectFolder))
      fs.promises.mkdir(projectFolder, { recursive: true });

    if (!fs.existsSync(resourcesFolder))
      fs.promises.mkdir(resourcesFolder);

    // Copy resources outside of project inside of its resources folder
    Object.values(data.resources).forEach(resource => {
      const resFolder = dirname(resource.path);

      if (resFolder.indexOf(resourcesFolder) !== 0) {
        let destination = resourcesFolder + '/' + resource.path.split('/').pop();

        if (fs.existsSync(destination)) {
          destination = destination.split('.');
          const extension = destination.pop();
          destination = `${destination.join('.')}_${Date.now()}.${extension}`;
        }

        fs.createReadStream(resource.path).pipe(fs.createWriteStream(destination));
        resource.path = destination;
      }
    });

    fs.writeFileSync(filename, JSON.stringify(data));
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
