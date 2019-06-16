const { app, /*crashReporter,*/ BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const isDev = require('electron-is-dev');
const SystemFonts = require('system-font-families');
const path = require('path');
const fs = require('fs');
const MenuActions = require('./MenuActions');
const MenuTemplate = require('./MenuTemplate');
const i18n = require('../constants/i18n');
const settings = require('electron-settings');

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

function updateMenu() {
  const menu = Menu.buildFromTemplate(MenuTemplate(sendAppEvent));
  Menu.setApplicationMenu(menu);
}

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

i18n.on('languageChanged', (code) => {
  updateMenu();
  sendAppEvent('languageChanged', code);
  settings.set('lang', code);
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

  mainWindow.once('ready-to-show', () => {
    updateMenu();
    mainWindow.show();
    if (settings.has('lang')) {
      i18n.changeLanguage(settings.get('lang'));
    }
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
