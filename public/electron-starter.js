const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const url = require('url');
const os_name = require("os-name");
const username = require("os").userInfo().username;
const driveList = require("drivelist");
const fs = require("fs");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 470,
        height: 626,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true
        },
        autoHideMenuBar:true,
        center:true
    });

    // and load the index.html of the app.
    const startUrl = process.env.ELECTRON_START_URL || url.format({
        pathname: path.join(__dirname, '../build/index.html'),
        protocol: 'file:',
        slashes: true
    });
    mainWindow.loadURL(startUrl);
    mainWindow.webContents.openDevTools();
    mainWindow.setResizable(false);

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        mainWindow = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit()
});

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) createWindow()
});

ipcMain.on("find-drives", (event, arg) => {
    mainWindow.setSize(470, 820, true);
    mainWindow.center();
});

ipcMain.on("main-screen", (event, args) => {
    mainWindow.setSize(1280, 720, 1);
    mainWindow.center();
});

ipcMain.on("reduce", (event, arg) => {
    mainWindow.setSize(470, 626, true);
    mainWindow.center();
});

ipcMain.on("close-window", (event, arg) => {
    mainWindow.close();
});

ipcMain.on("minimize", (event, arg) => {
    mainWindow.minimize();
});

ipcMain.on("toggle_maximize", (event, arg) => {
    if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
    } else {
        mainWindow.maximize();
    }
});

ipcMain.on("fill", (event , arg) => {
    //win.setFullScreen(true)
    mainWindow.setResizable(true);
    mainWindow.maximize();
});

ipcMain.on("getDrives", (event, arg) => {
    driveList
        .list()
        .then(result => {
            //event.sender.send("returnDrives", result);
            event.returnValue = result;
        })
        .catch(err => {
            console.log(err);
        });
});

ipcMain.on("getOs", (event, arg) => {
    event.sender.send("returnOs", os_name().toUpperCase());
});

ipcMain.on("checkLaunchers", (event, arg) => {
    if (fs.existsSync(arg)) {
        event.returnValue = ("return", "exists");
    } else {
        event.returnValue = ("return", "not exists");
    }
});

ipcMain.on("getUsername", (event, arg) => {
    event.returnValue = username;
});

ipcMain.on("getFiles", (event, arg) => {
    event.returnValue = fs.readdirSync(arg);
});
