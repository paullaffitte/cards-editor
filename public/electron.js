const {app, BrowserWindow} = require('electron');
// TODO const isDev = require('electron-is-dev'); 

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({width: 800, height: 600});
  mainWindow.loadFile(__dirname + '/../build/index.html');
  // TODO isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow)

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
