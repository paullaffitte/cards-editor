const { app, /*crashReporter,*/ BrowserWindow, Menu, ipcMain } = require('electron');
const fs = require('fs');
const isDev = require('electron-is-dev');
const MenuActions = require('./MenuActions');

let mainWindow;

function sendAppEvent(name, callback, ...args) {
  mainWindow.webContents.send(name + '-event', ...args);
  let replyName = name + '-event-reply';
  ipcMain.once(replyName, (event, ...replyArgs) => {
    console.log(replyName, replyArgs);
    callback(event, ...replyArgs);
  });
}

function menuLabelWithEvent(label, ...args) {
  return {
    label,
    click: () => sendAppEvent(label, MenuActions[label], ...args)
  };
}

const menuTemplate = [
  {
    label: 'File',
    submenu: [
      menuLabelWithEvent('open'),
      menuLabelWithEvent('save'),
      menuLabelWithEvent('saveAs'),
      {type: 'separator'},
      {role: 'quit'},
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
      {role: 'reload'},
      {role: 'forceReload'},
      {role: 'toggleDevTools'},
      {type: 'separator'},
      {role: 'resetZoom'},
      {role: 'zoomIn'},
      {role: 'zoomOut'},
      {role: 'toggleFullScreen'},
    ]
  }
];

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

    console.log('send event');
    mainWindow.webContents.send('my-custom-event', 23, 98, 3, 61);
    ipcMain.once('my-custom-event-reply', (event, sum) => {
      console.log('result', sum)
    })
  });

  mainWindow.webContents.once('dom-ready', () => {
  })
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
