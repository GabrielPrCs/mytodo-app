import { app, BrowserWindow, Menu, dialog, globalShortcut } from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import { enableLiveReload } from 'electron-compile';

import lang from './redux/state/partials/lang/_es.json'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const isDevMode = process.execPath.match(/[\\/]electron/);

if (isDevMode) enableLiveReload({ strategy: 'react-hmr' });

const createWindow = async () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 800,
    minHeight: 600
  })

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // Open the DevTools.
  if (isDevMode) {
    await installExtension(REACT_DEVELOPER_TOOLS);
    mainWindow.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  let newFile = {
    label: lang.menubar.file.newFile.label,
    accelerator: lang.menubar.file.newFile.accelerator,
  }

  let openFile = {
    label: lang.menubar.file.openFile.label,
    accelerator: lang.menubar.file.openFile.accelerator,
    click: () => {
      dialog.showOpenDialog({}, file => {
          if (file !== undefined) mainWindow.webContents.send('open-file', file[0])
      })
    }
  }

  let saveFile = {
    label: lang.menubar.file.saveFileAs.label,
    accelerator: lang.menubar.file.saveFileAs.accelerator,
    click: () => {
      dialog.showSaveDialog({}, file => {
          if(file !== undefined) mainWindow.webContents.send('save-file', file)
      })
    }
  }

  let addItem = {
    label: lang.menubar.editor.addItem.label,
    accelerator: lang.menubar.editor.addItem.accelerator,
  }

  // As Control+A is select all, the addItem accelerator has to be added globally
  globalShortcut.register(lang.menubar.editor.addItem.accelerator, () => {
    mainWindow.webContents.send('add-item')
  })

  let template = [
      {
        label: lang.menubar.file.label,
        accelerator: lang.menubar.file.accelerator,
        submenu: [ newFile, openFile, saveFile ]
      },
      {
        label: lang.menubar.editor.label,
        accelerator: lang.menubar.editor.accelerator,
        submenu: [addItem]
      }
    ]

  // mainWindow.setMenu(Menu.buildFromTemplate(template))

};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
