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
const dialog = require("electron").dialog;
const sizeOf = require("image-size");
const archiver = require("archiver");
const request = require("request");
let mainWindow;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 470,
        height: 626,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: true,
            webSecurity: false
        },
        autoHideMenuBar: true,
        center: true,
        frame: false,
        icon: path.join(__dirname, "/src/images/logoPlc.png")
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
    //mainWindow.setResizable(false);

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

ipcMain.on("checkLocationExists", (event, arg) => {
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

ipcMain.on("getFolder", event => {
    dialog.showOpenDialog(
        null,
        { properties: ["openDirectory"] },
        filePaths => {
            event.sender.send("returnFolder", filePaths);
        }
    );
});

ipcMain.on("getImage", (event, args) => {
    dialog.showOpenDialog(
        null,
        {
            filters: [{ name: "images", extensions: ["jpg", "png", "gif"] }],
            properties: ["openFile"]
        },
        file => {
            fs.copyFile(
                file[0],
                path.join(args, path.basename(file[0])),
                function(err) {
                    if (err) throw err;
                }
            );
            const dimensions = sizeOf(file[0]);
            const image = fs.readFileSync(file[0]).toString("base64");
            event.sender.send("returnImage", {
                file: image,
                location: path.join(args, path.basename(file[0])),
                width: dimensions.width,
                height: dimensions.height
            });
        }
    );
});

ipcMain.on("getImageRaw", (event, args) => {
    const image = fs.readFileSync(args).toString("base64");
    event.returnValue = image;
});

ipcMain.on("createFile", (event, arg) => {
    fs.appendFile(arg.name, arg.contents, function(err) {
        if (err) throw err;
        event.returnValue = "success";
    });
});

ipcMain.on("createFolder", (event, arg) => {
    fs.mkdir(arg, function(err) {
        if (err) throw err;
        event.returnValue = "success";
    });
});

ipcMain.on("overwriteFile", (event, arg) => {
    fs.writeFile(arg.name, arg.contents, function(err) {
        if (err) throw err;
        event.returnValue = "success";
    });
});

ipcMain.on("readFile", (event, arg) => {
    fs.readFile(arg.path, "utf8", function(err, data) {
        if (err) throw err;
        event.returnValue = data;
    });
});

ipcMain.on("archiveGame", (event, args) => {
    const output = fs.createWriteStream(args.write);
    const archive = archiver("zip", {
        zlib: { level: 1 } // Sets the compression level.
    });
    archive.pipe(output);
    archive.directory(args.path, args.game);
    archive.finalize();
    output.on("close", function() {
        console.log(archive.pointer() + " total bytes");
    });
    event.sender.send("gameArchived");
});

ipcMain.on("createFolderDrive", (event, args) => {
    return new Promise((resolve, reject) => {
        request.post(
            "https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable",
            {
                headers: {
                    Authorization: `Bearer ${args.auth}`
                },
                body: {
                    name: args.title,
                    mimeType: "application/vnd.google-apps.folder",
                    parents: [args.parent]
                },
                mimeType: "application/vnd.google-apps.folder",
                json: true
            },
            (err, res) => {
                request.post(
                    res.headers.location,
                    {
                        headers: {
                            Authorization: `Bearer ${args.auth}`
                        },
                        mimeType: "application/vnd.google-apps.folder"
                    },
                    (err, res) => {
                        if (err) throw err;
                        event.returnValue = res;
                    }
                );
            }
        );
    });
});

ipcMain.on("uploadFile", (event, args) => {
    console.log("uploading");
    return new Promise((resolve, reject) => {
        request.post(
            "https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable",
            {
                headers: {
                    Authorization: `Bearer ${args.auth}`
                },
                body: {
                    name: args.title,
                    parents: [args.parent]
                },
                json: true
            },
            (err, res) => {
                request.post(
                    res.headers.location,
                    {
                        headers: {
                            Authorization: `Bearer ${args.auth}`
                        },
                        body: fs.createReadStream(
                            path.join(
                                "/Users/UNAME/Library/Application Support/Cloud-link/files/".replace(
                                    "UNAME",
                                    args.username
                                ),
                                args.file
                            )
                        )
                    },
                    (err, res) => {
                        if (err) throw event.sender.send("uploadError");
                        event.sender.send("uploadComplete");
                    }
                );
            }
        );
    });
});

ipcMain.on("downloadFile", (event, { url, path, game, auth }) => {
    request
        .get(url, {
            headers: {
                Authorization: `Bearer ${auth}`
            }
        })
        .on("response", function(response) {
            //LOG THIS
        })
        .pipe(fs.createWriteStream(`${path}/${game}.zip`));
    event.returnValue = "successrs#";
});

ipcMain.on("downloadFile2", (event, { path, games, auth }) => {
    games.forEach(game => {
        request.get(
            `https://www.googleapis.com/drive/v2/files/${game.id}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${auth}`
                },
                json: true
            },
            (err, response) => {
                if (err) throw err;
                if (response.body.downloadUrl) {
                    request
                        .get(response.body.downloadUrl, {
                            headers: {
                                Authorization: `Bearer ${auth}`
                            }
                        })
                        .on("response", function(response) {
                            //LOG THIS
                        })
                        .pipe(fs.createWriteStream(`${path}/${game.name}.zip`));
                } else {
                    console.log(response.body);
                }
            }
        );
    })
    event.returnValue = "success";
});

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
                scope: [
                    "https://www.googleapis.com/auth/userinfo.profile",
                    "https://www.googleapis.com/auth/drive.readonly",
                    "https://www.googleapis.com/auth/drive"
                ]
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
    project_id: "cloud-link",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_secret: "BpD8aT6LUpMGlE4f_XOqSAVO",
    redirect_uris: "http://localhost:PORT"
};
