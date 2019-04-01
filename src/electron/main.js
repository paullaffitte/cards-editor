const { app, /*crashReporter,*/ BrowserWindow, Menu, ipcMain } = require('electron');
const isDev = require('electron-is-dev');
const SystemFonts = require('system-font-families');
const MenuActions = require('./MenuActions');

const systemFonts = new SystemFonts.default();

let mainWindow;

ipcMain.on('exportAsPDF', MenuActions.exportAsPDF);
ipcMain.on('getAvailableFonts', event => event.sender.send('availableFonts', systemFonts.getFontsSync()));

function sendAppEvent(name) {
  mainWindow.webContents.send(name);
}

function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
    return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
  }).replace(/\s+/g, '');
}

function menuLabelWithEvent(label, accelerator=null) {
  accelerator = accelerator ? {accelerator} : {};
  const name = camelize(label);
  return {
    label,
    ...accelerator,
    click: () => sendAppEvent(name)
  };
}

const menuTemplate = [
  {
    label: 'File',
    submenu: [
      menuLabelWithEvent('New', 'CmdOrCtrl+N'),
      menuLabelWithEvent('Open', 'CmdOrCtrl+O'),
      menuLabelWithEvent('Save', 'CmdOrCtrl+S'),
      menuLabelWithEvent('Save as', 'Shift+CmdOrCtrl+S'),
      {type: 'separator'},
      menuLabelWithEvent('Export as PDF', 'CmdOrCtrl+E'),
      {type: 'separator'},
      {role: 'quit', accelerator: 'Alt+F4'},
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
    label: 'View',
    submenu: [
      {role: 'resetZoom'},
      {role: 'zoomIn'},
      {role: 'zoomOut' }
    ]
  }
];

if (isDev)
  menuTemplate.push({
    label: 'Dev tools',
    submenu: [
      {role: 'reload'},
      {role: 'forceReload'},
      {role: 'toggleDevTools'},
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
        label: 'Inspect element',
        click() {
          mainWindow.inspectElement(props.x, props.y);
        },
      },
    ]).popup(mainWindow);
  });
}
