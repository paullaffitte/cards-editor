const { app, /*crashReporter,*/ BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const isDev = require('electron-is-dev');
const SystemFonts = require('system-font-families');
const path = require('path');
const fs = require('fs');
const MenuActions = require('./MenuActions');
const i18n = require('../constants/i18n');

const systemFonts = new SystemFonts.default();

let mainWindow;
let quitConfirmed = false;
const fileToOpen = process.argv[1];

ipcMain.on('ready', () => {
  if (fileToOpen) {
    const isDirectory = fs.lstatSync(fileToOpen).isDirectory();
    sendAppEvent('open', fs.realpathSync(fileToOpen + (isDirectory ? '/deck.json' : '')));
  }
});
ipcMain.on('exportAsPDF', MenuActions.exportAsPDF);
ipcMain.on('getAvailableFonts', event => event.sender.send('availableFonts', systemFonts.getFontsSync()));
ipcMain.on('quit', () => {
  quitConfirmed = true;
  mainWindow.close();
});

function sendAppEvent(name, ...args) {
  return mainWindow.webContents.send(name, ...args);
}

function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
    return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
  }).replace(/\s+/g, '');
}

function menuLabelWithEvent(label, accelerator) {
  const name = camelize(label);
  return {
    label,
    accelerator,
    click: () => sendAppEvent(name)
  };
}

function menuRole(role, accelerator) {
  return {
    role,
    accelerator,
    label: i18n.t(`electron.menu.${role}`),
  };
}

const menuTemplate = [
  {
    label: i18n.t('electron.menu.file'),
    submenu: [
      menuLabelWithEvent(i18n.t('electron.menu.new'), 'CmdOrCtrl+N'),
      menuLabelWithEvent(i18n.t('electron.menu.open'), 'CmdOrCtrl+O'),
      menuLabelWithEvent(i18n.t('electron.menu.save'), 'CmdOrCtrl+S'),
      menuLabelWithEvent(i18n.t('electron.menu.saveAs'), 'Shift+CmdOrCtrl+S'),
      {type: 'separator'},
      menuLabelWithEvent(i18n.t('electron.menu.exportAsPDF'), 'CmdOrCtrl+E'),
      {type: 'separator'},
      menuRole('quit', 'Alt+F4'),
    ]
  },
  /*
  {
    label: 'Edit',
    submenu: [
      {role: 'undo'},
      {role: 'redo'},
    ]
  },
  */
  {
    label: i18n.t('electron.menu.view'),
    submenu: [
      menuRole('resetZoom'),
      menuRole('zoomIn'),
      menuRole('zoomOut'),
    ]
  }
];

if (isDev)
  menuTemplate.push({
    label: i18n.t('electron.menu.devTools'),
    submenu: [
      menuRole('reload'),
      menuRole('forceReload'),
      menuRole('toggleDevTools'),
    ]
  });

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// crashReporter.start({
//   productName: 'YourName',
//   companyName: 'YourCompany',
//   submitURL: 'https://your-domain.com/url-to-submit',
//   uploadToServer: false,
// });

async function createWindow() {
  mainWindow = new BrowserWindow({width: 1200, height: 720, show: false, webPreferences: {webSecurity: !isDev}});

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    await installExtensions();
    openDevTools();
  } else {
    mainWindow.loadFile(__dirname + '/../../build/index.html');
  }

  mainWindow.on('close', async e => {
    if (quitConfirmed)
      return;

    e.preventDefault();
    sendAppEvent('quit');
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.once('ready-to-show', async () => {
    const menu = Menu.buildFromTemplate(menuTemplate)
    Menu.setApplicationMenu(menu)

    await mainWindow.show();
  });
}

async function installExtensions() {
  const installer = require('electron-devtools-installer');
  const extensions = ['REACT_DEVELOPER_TOOLS'];//, 'REDUX_DEVTOOLS'];
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  for (const name of extensions) {
    try {
      await installer.default(installer[name], forceDownload);
    } catch (e) {
      console.log(`Error installing ${name} extension: ${e.message}`);
    }
  }
};

function openDevTools() {
  mainWindow.webContents.openDevTools();
  mainWindow.webContents.on('context-menu', (e, props) => {
    Menu.buildFromTemplate([
      {
        label: i18n.t('electron.menu.inspectElement'),
        click() {
          mainWindow.inspectElement(props.x, props.y);
        },
      },
    ]).popup(mainWindow);
  });
}
