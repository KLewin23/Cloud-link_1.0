const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const url = require("url");
const os_name = require("os-name");
const username = require("os").userInfo().username;
const driveList = require("drivelist");
const fs = require("fs");
const OAuth2Client = require("google-auth-library").OAuth2Client;
const http = require("http");
const destroyer = require("server-destroy");
const fp = require("find-free-port");

let mainWindow;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 470,
        height: 626,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: true
        },
        autoHideMenuBar: true,
        center: true
    });

    // and load the index.html of the app.
    const startUrl =
        process.env.ELECTRON_START_URL ||
        url.format({
            pathname: path.join(__dirname, "../build/index.html"),
            protocol: "file:",
            slashes: true
        });
    mainWindow.loadURL(startUrl);
    mainWindow.webContents.openDevTools();
    mainWindow.setResizable(false);

    // Emitted when the window is closed.
    mainWindow.on("closed", function() {
        mainWindow = null;
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function() {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") app.quit();
});

app.on("activate", function() {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) createWindow();
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

ipcMain.on("fill", (event, arg) => {
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

ipcMain.on("Authenticate", (event, arg) => {
    getAuthenticatedUser()
        .then(auth => (event.returnValue = auth))
        .catch(err => console.log(err));
});

// function getPort(){
//     const portTest = Math.floor(Math.random() * (60000 - 4000) + 4000);
//     detect(portTest, (err, _port) => {
//         if (err) {
//             console.log(err);
//         }
//         if (portTest === _port) {
//             return portTest
//         } else {
//             return "Fail"
//         }
//     });
// }

function getAuthenticatedUser() {
    return new Promise((resolve, reject) => {
        fp(4000, 60000).then(freePort => {
            const port = freePort[0];
            const oAuth2Client = new OAuth2Client(
                installed.client_id,
                installed.client_secret,
                installed.redirect_uris.replace("PORT", port)
            );

            // Generate the url that will be used for the consent dialog.
            const authorizeUrl = oAuth2Client.generateAuthUrl({
                access_type: "offline",
                scope: "https://www.googleapis.com/auth/userinfo.profile"
            });
            const server = http
                .createServer(async (req, res) => {
                    const qs = new url.URL(
                        req.url,
                        installed.redirect_uris.replace("PORT", port)
                    ).searchParams;
                    const token = await oAuth2Client.getToken(qs.get("code"));
                    res.end();
                    server.destroy();
                    BrowserWindow.getFocusedWindow().destroy();
                    resolve(token.tokens);
                })
                .listen(port, () => {
                    const authWin = new BrowserWindow({
                        height: 600,
                        width: 600,
                        autoHideMenuBar: true,
                        center: true
                    });
                    authWin.loadURL(authorizeUrl);
                    //open(authorizeUrl, { wait: false }).then(cp => cp.unref());
                })
                .on("error", err => console.log(err));
            destroyer(server);
        });
    });
}

installed = {
    client_id:
        "522213692282-5k8lrh37i249rcaorh79n971to0acioc.apps.googleusercontent.com",
    project_id: "cloud-gamesave-manager",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_secret: "BpD8aT6LUpMGlE4f_XOqSAVO",
    redirect_uris: "http://localhost:PORT"
};
