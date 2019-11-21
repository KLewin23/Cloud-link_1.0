import store from "../store";
import {
    setConfigPath,
    setBaseConfig,
    setGamePaths,
    setImageConfigPath,
    setClGamesFolder,
    setClMainFolder,
    setClConfigId,
    setClConfig, setTempLocPath
} from "../store/actions";
import CheckFileExistance from "./functions/CheckFileExistance";
import request from "request";
import DriveConfig from "../Config/DefaultDriveConfig";
import { GetUsername } from "../scripts/Scanner";
import getGoogleFileContents from "./functions/GetGoogleFileContents";
import getGoogleFolderChildren from "./functions/GetGoogleFolderChildren";
const { ipcRenderer } = window.require("electron");

export function ConfigMain(app, username) {
    const paths = {
        WIN: {
            files: "C:\\Users\\UNAME\\AppData\\Roaming\\Cloud-link\\files".replace(
                "UNAME",
                username
            ),
            driveConfig: "C:\\Users\\UNAME\\AppData\\Roaming\\Cloud-link\\files\\DefaultDriveConfig.json".replace(
                "UNAME",
                username
            ),
            gameDir: "C:\\Users\\UNAME\\AppData\\Roaming\\Cloud-link\\files\\GAMENAME".replace(
                "UNAME",
                username
            ),
            configPath: "C:\\Users\\UNAME\\AppData\\Roaming\\Cloud-link\\config.json".replace(
                "UNAME",
                username
            )
        },
        MAC: {
            files: "/Users/UNAME/Library/Application Support/Cloud-link/files/".replace(
                "UNAME",
                username
            ),
            driveConfig: "/Users/UNAME/Library/Application Support/Cloud-link/files/DefaultDriveConfig.json".replace(
                "UNAME",
                username
            ),
            gameDir: `/Users/UNAME/Library/Application Support/Cloud-link/files/GAMENAME`.replace(
                "UNAME",
                username
            ),
            configPath: "/Users/UNAME/Library/Application Support/Cloud-link/config.json".replace(
                "UNAME",
                username
            ),
            tempLoc: "/Users/UNAME/Library/Application Support/Cloud-link/files/temp".replace(
                "UNAME",
                username
            )
        }
    };
    const osPaths = paths[app.os];
    if (CheckFileExistance(osPaths.files) !== "exists") {
        if (ipcRenderer.sendSync("createFolder", osPaths.files) !== "success") {
            CreationError(osPaths.files)
        }
    }
    ["localArchives", "driveArchives"].forEach(name => {
        const dirPath = osPaths.gameDir.replace("GAMENAME", name);
        if (CheckFileExistance(dirPath) !== "exists") {
            if (ipcRenderer.sendSync("createFolder", dirPath) !== "success") {
                CreationError(dirPath)
            }
        }
    });
    if (CheckFileExistance(osPaths.driveConfig) !== "exists") {
        if (
            ipcRenderer.sendSync("createFile", {
                name: osPaths.driveConfig,
                contents: JSON.stringify(DriveConfig)
            }) !== "success"
        ) {
            CreationError(osPaths.driveConfig)
        }
    }
    if (CheckFileExistance(osPaths.configPath) !== "exists") {
        ipcRenderer.sendSync("createFile", {
            name: osPaths.configPath,
            contents: JSON.stringify(app.config)
        });
        store.dispatch(setConfigPath(osPaths.configPath));
    } else {
        const config = ipcRenderer.sendSync("readFile", {
            path: osPaths.configPath
        });
        store.dispatch(setBaseConfig(config));
        reduxComparison(app, config);
    }
    if (CheckFileExistance(osPaths.tempLoc) !== "exists") {
        if (ipcRenderer.sendSync( "createFolder", osPaths.tempLoc) !== "success") {
            CreationError(osPaths.tempLoc)
        } else {
            store.dispatch(setTempLocPath(osPaths.tempLoc))
        }
    } else {
        store.dispatch(setTempLocPath(osPaths.tempLoc))
    }
    imageConfigMain(app, username);
    getCloudConfig(app, username);
}

export function updateFile(app, username) {
    ipcRenderer.sendSync("overwriteFile", {
        name: app.config.filePath,
        contents: JSON.stringify(app.config)
    });
}

function CreationError(item){
    alert(
        `Error: ${item} not created this will cause issues`
    )
}

function reduxComparison(app, config) {
    if (Object.keys(JSON.parse(config)).includes("games")) {
        const combinedGamePaths = Object.keys(app.gamePaths).reduce(
            (acc, key) => {
                return !Object.keys(JSON.parse(config).games).includes(key)
                    ? { ...acc, [key]: app.gamePaths[key] }
                    : { ...acc };
            },
            JSON.parse(config).games
        );
        store.dispatch(setGamePaths(combinedGamePaths));
    }
}

function imageConfigMain(app, username) {
    const pathList = {
        WIN: {
            image: "C:\\Users\\UNAME\\AppData\\Roaming\\Cloud-link\\Images".replace(
                "UNAME",
                username
            )
        },
        MAC: {
            image: "/Users/UNAME/Library/Application Support/Cloud-link/Images".replace(
                "UNAME",
                username
            )
        }
    };
    if (!Object.keys(pathList).includes(app.os)) {
        console.log("Error: your os is not listed");
        throw '';
    }
    const imageFolder = pathList[app.os].image;
    const imageFolderExists = CheckFileExistance(imageFolder);
    if (imageFolderExists !== "exists") {
        console.log(imageFolderExists);
        if (ipcRenderer.sendSync("createFolder", imageFolder) === "success") {
            store.dispatch(setImageConfigPath(imageFolder));
        } else {
            alert("Error when creating image folder");
        }
    } else if (imageFolderExists === "exists" && app.config.imagePath === "") {
        store.dispatch(setImageConfigPath(imageFolder));
    }
}

export function getCloudConfig(app, username) {
    hasGoogleObject(
        "",
        app,
        "Cloud-link",
        resultHandler,
        "application/vnd.google-apps.folder"
    );
}

function verifyData(files, filename, type, parent) {
    const objects = files.files.filter(file => file.mimeType === type);
    const parents =
        parent !== undefined
            ? files.files.filter(file => file.parents[0] === parent)
            : objects;
    const cloudLink = parents.filter(
        file =>
            file.name.toUpperCase() === filename.toUpperCase() &&
            file.trashed === false &&
            file.explicitlyTrashed === false
    );
    return [cloudLink.length === 1 ? cloudLink[0].id : false, objects];
}

export function hasGoogleObject(token, app, filename, callback, type, parent) {
    const name = `name%3D%27${filename}%27`;
    request.get(
        `https://www.googleapis.com/drive/v3/files?q=${name}&fields=nextPageToken,files(parents,mimeType,name,id,trashed,explicitlyTrashed)&pageToken=${token}`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${app.authKey}`
            },
            json: true
        },
        (err, response) => {
            if (err) {
                throw err;
            } else {
                const folderCheck = verifyData(
                    response.body,
                    filename,
                    type,
                    parent
                );
                // prettier-ignore
                if (folderCheck[0] !== false) {
                    callback(folderCheck,app);
                } else if (folderCheck[0] === false && !Object.keys(response.body).includes('nextPageToken')) {
                    callback(folderCheck,app)
                } else {
                    hasGoogleObject(response.body.nextPageToken, app);
                }
            }
        }
    );
}

function resultHandler(result, app) {
    if (result[0] !== false) {
        hasGoogleObject(
            "",
            app,
            "Cloud-link-games",
            gamesFolderHandler,
            "application/vnd.google-apps.folder"
        );
        store.dispatch(setClMainFolder(result[0]));
    } else {
        const createFolder = ipcRenderer.sendSync("createFolderDrive", {
            title: "Cloud-link",
            auth: app.authKey,
            parent: ""
        });
        if (createFolder.statusCode === 200) {
            store.dispatch(setClMainFolder(JSON.parse(createFolder.body).id));
            const uploadResult = ipcRenderer.sendSync("uploadFile", {
                title: "config.json",
                file: "DefaultDriveConfig.json",
                type: "application/vnd.google-apps.document",
                parent: JSON.parse(createFolder.body).id,
                auth: app.authKey,
                username: GetUsername()
            });
            if (uploadResult.statusCode !== 200) {
                alert("Error: uploading the config to google drive");
            }
            const gamesFolder = ipcRenderer.sendSync("createFolderDrive", {
                title: "Cloud-link-games",
                auth: app.authKey,
                parent: result[0]
            });
            if (gamesFolder.statusCode !== 200) {
                alert("Error: creating games folder");
            } else {
                store.dispatch(setClGamesFolder(gamesFolder.id));
            }
        } else {
            alert("Error: cloud-link folder not created in google drive");
        }
    }
}

function gamesFolderHandler(result, app) {
    if (result[0] === false) {
        const gamesFolder = ipcRenderer.sendSync("createFolderDrive", {
            title: "Cloud-link-games",
            auth: app.authKey,
            parent: result[0]
        });
        if (gamesFolder.statusCode !== 200) {
            alert("Error: creating games folder");
        } else {
            store.dispatch(setClGamesFolder(JSON.parse(gamesFolder.body).id));
        }
    } else {
        store.dispatch(setClGamesFolder(result[0]));
        getGoogleFolderChildren('',app.authKey,result[0]);
        hasGoogleObject(
            "",
            app,
            "config.json",
            handleGoogleConfig,
            "application/vnd.google-apps.document",
            store.getState().GoogleReducer.clMainFolder
        );
    }
}

function handleGoogleConfig(result, app) {
    if (result[0] !== false) {
        store.dispatch(setClConfigId(result[0]));
        getGoogleFileContents(result[0], app.authKey, result => {
            if (result === null) {
                alert("Error: attempt to download config has gone wrong");
            } else {
                store.dispatch(setClConfig(JSON.parse(result)));
            }
        });
    } else {
        const uploadResult = ipcRenderer.sendSync("uploadFile", {
            title: "config.json",
            file: "DefaultDriveConfig.json",
            type: "application/vnd.google-apps.document",
            parent: store.getState().GoogleReducer.clMainFolder,
            auth: app.authKey,
            username: GetUsername()
        });
        if (uploadResult.statusCode !== 200) {
            alert("Error: uploading the config to google drive");
        }
    }
}
