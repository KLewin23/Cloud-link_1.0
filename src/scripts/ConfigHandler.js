import store from "../store";
import {
    setConfigPath,
    setBaseConfig,
    setGamePaths,
    setImageConfigPath
} from "../store/actions";
import CheckFileExistance from "./functions/CheckFileExistance";
import request from "request";
import DriveConfig from "../Config/DefaultDriveConfig";
const { ipcRenderer } = window.require("electron");

export function ConfigMain(app, username) {
    if (app.os === "WIN") {
        const filesPath = "C:\\Users\\UNAME\\AppData\\Roaming\\Cloud-link\\files".replace(
            "UNAME",
            username
        );
        if (CheckFileExistance(filesPath) !== "exists") {
            if (ipcRenderer.sendSync("createFolder", filesPath) !== "success") {
                alert(
                    `Error: ${filesPath} not created... this will cause issues`
                );
            }
        }
        const driveConfigPath = "C:\\Users\\UNAME\\AppData\\Roaming\\Cloud-link\\files\\DefaultDriveConfig.json".replace(
            "UNAME",
            username
        );
        if (CheckFileExistance(driveConfigPath) !== "exists") {
            if (
                ipcRenderer.sendSync("createFile", {
                    name: driveConfigPath,
                    contents: JSON.stringify(DriveConfig)
                }) !== "success"
            ) {
                alert(
                    `Error: ${driveConfigPath} not created this will cause issues`
                );
            }
        }
        const configPath = "C:\\Users\\UNAME\\AppData\\Roaming\\Cloud-link\\config.json".replace(
            "UNAME",
            username
        );
        if (CheckFileExistance(configPath) !== "exists") {
            ipcRenderer.sendSync("createFile", {
                name: configPath,
                contents: JSON.stringify(app.config)
            });
            store.dispatch(setConfigPath(configPath));
        } else {
            const config = ipcRenderer.sendSync("readFile", {
                path: configPath
            });
            store.dispatch(setBaseConfig(config));
            reduxComparison(app, config);
        }
        imageConfigMain(app, username);
    } else if (app.os === "MAC") {
        ///////
        //MAC//
        ///////
        const filesPath = "/Users/UNAME/Library/Application Support/Cloud-link/files/".replace(
            "UNAME",
            username
        );
        if (CheckFileExistance(filesPath) !== "exists") {
            if (ipcRenderer.sendSync("createFolder", filesPath) !== "success") {
                alert(
                    `Error: ${filesPath} not created... this will cause issues`
                );
            }
        }
        ["localArchives","driveArchives"].forEach(name=>{
            const dirPath = `/Users/UNAME/Library/Application Support/Cloud-link/files/${name}`.replace("UNAME",username)
            if (CheckFileExistance(dirPath) !== "exists"){
                if(ipcRenderer.sendSync("createFolder", dirPath) !== "success"){
                    alert(`Error: ${dirPath} not created this will cause issues`)
                }
            }
        });
        const driveConfigPath = "/Users/UNAME/Library/Application Support/Cloud-link/files/DefaultDriveConfig.json".replace(
            "UNAME",
            username
        );
        if (CheckFileExistance(driveConfigPath) !== "exists") {
            if (
                ipcRenderer.sendSync("createFile", {
                    name: driveConfigPath,
                    contents: JSON.stringify(DriveConfig)
                }) !== "success"
            ) {
                alert(
                    `Error: ${driveConfigPath} not created this will cause issues`
                );
            }
        }
        const configPath = "/Users/UNAME/Library/Application Support/Cloud-link/config.json".replace(
            "UNAME",
            username
        );
        if (CheckFileExistance(configPath) !== "exists") {
            ipcRenderer.sendSync("createFile", {
                name: configPath,
                contents: JSON.stringify(app.config)
            });
            store.dispatch(setConfigPath(configPath));
        } else {
            const config = ipcRenderer.sendSync("readFile", {
                path: configPath
            });
            store.dispatch(setBaseConfig(config));
            reduxComparison(app, config);
        }
        imageConfigMain(app, username);


    } else if (app.os === "LIN") {
        // const saveLocation = CheckFileExistance(
        //     "~/.config/CloudGameSaveManager/config.json"
        // );
    } else {
        alert("Error: OS does not conform to requirements");
    }
    //getCloudConfig(app, username);
}

export function updateFile(app, username) {
    ipcRenderer.sendSync("overwriteFile", {
        name: app.config.filePath,
        contents: JSON.stringify(app.config)
    });
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
    if (app.os === "WIN") {
        const imageFolder = "C:\\Users\\UNAME\\AppData\\Roaming\\Cloud-link\\Images".replace(
            "UNAME",
            username
        );
        const imageFolderExists = CheckFileExistance(imageFolder);
        if (imageFolderExists !== "exists") {
            if (
                ipcRenderer.sendSync("createFolder", imageFolder) === "success"
            ) {
                store.dispatch(setImageConfigPath(imageFolder));
            } else {
                alert("Error when creating image folder");
            }
        } else if (
            imageFolderExists === "exists" &&
            app.config.imagePath === ""
        ) {
            store.dispatch(setImageConfigPath(imageFolder));
        }
    } else if (app.os === "MAC") {
        const imageFolder = "/Users/UNAME/Library/Application Support/Cloud-link/Images".replace(
            "UNAME",
            username
        );
        if (CheckFileExistance(imageFolder) !== "exists") {
            if (
                ipcRenderer.sendSync("createFolder", imageFolder) === "success"
            ) {
                store.dispatch(setImageConfigPath(imageFolder));
            } else {
                alert("Error when creating image folder");
            }
        }
    } else if (app.os === "LIN") {
    } else {
        alert("Error: OS does not conform to requirements");
    }
}

export function getCloudConfig(app, username) {
    new Promise(resolve => {
        request(
            {
                method: "get",
                uri: "https://www.googleapis.com/drive/v2/files?trashed=false",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${app.authKey}`
                }
            },
            function(err, response, body) {
                if (err) {
                    console.log(err);
                } else {
                    resolve(JSON.parse(response.body));
                }
            }
        );
    })
        .then(files => {
            const folders = files.items.filter(
                file => file.mimeType === "application/vnd.google-apps.folder"
            );
            const cloudr = folders.filter(
                file => file.title.toUpperCase() === "CLOUDR"
            );
            const hasCloudr =
                cloudr.length === 1 && cloudr[0].explicitlyTrashed === false;
            return hasCloudr ? cloudr[0].id : false;
        })
        .then(result => {
            if (result !== false) {
                console.log("has file");
            } else {
                const createFolder = ipcRenderer.sendSync("createFolderDrive", {
                    title: "Cloud-link",
                    auth: app.authKey
                });
                if (createFolder.statusCode === 200) {

                    const result = ipcRenderer.sendSync("uploadFile", {
                        title: "config.json",
                        file: "DefaultDriveConfig.json",
                        type: "application/vnd.google-apps.document",
                        parent: JSON.parse(createFolder.body).id,
                        auth: app.authKey,
                        username: username
                    });
                    if (result.statusCode !== 200) {
                        alert("Error: uploading the config to google drive");
                    }
                } else {
                    alert(
                        "Error: cloud-link folder not created in google drive"
                    );
                }
            }
        });
}
