import store from "../store";
import {
    setConfigPath,
    setBaseConfig,
    setGamePaths,
    setImageConfigPath
} from "../store/actions";
import CheckFileExistance from "./functions/CheckFileExistance";
const { ipcRenderer } = window.require("electron");

export function ConfigMain(app, username) {
    if (app.os === "WIN") {
        const configPath = "C:\\Users\\UNAME\\AppData\\Roaming\\CloudGameSaveManager\\config.json".replace(
            "UNAME",
            username
        );
        if (CheckFileExistance(configPath) !== "exists") {
            ipcRenderer.sendSync("createFile", {
                name: configPath,
                contents: JSON.stringify(app.config)
            });
            store.dispatch(setConfigPath(configPath));
        }else{
            const config = ipcRenderer.sendSync("readFile", {
                path: configPath
            });
            store.dispatch(setBaseConfig(config));
            reduxComparison(app, config);
        }
        imageConfigMain(app, username);
    } else if (app.os === "MAC") {
        const configPath = "/Users/UNAME/Library/Application Support/CloudGameSaveManager/config.json".replace(
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
}

export function updateFile(app, username) {
    ipcRenderer.sendSync("overwriteFile", {
        name: app.config.filePath,
        contents: JSON.stringify(app.config)
    });
}

function reduxComparison(app, config) {
    if (Object.keys(JSON.parse(config)).includes("games")){
        const combinedGamePaths = Object.keys(app.gamePaths).reduce((acc, key) => {
            return !Object.keys(JSON.parse(config).games).includes(key)
                ? { ...acc, [key]: app.gamePaths[key] }
                : { ...acc };
        }, JSON.parse(config).games);
        store.dispatch(setGamePaths(combinedGamePaths));
    }
}

function imageConfigMain(app, username) {
    if (app.os === "WIN") {
        const imageFolder = "C:\\Users\\UNAME\\AppData\\Roaming\\CloudGameSaveManager\\Images".replace(
            "UNAME",
            username
        );
        const imageFolderExists = CheckFileExistance(imageFolder);
        if(imageFolderExists !== "exists"){
            if (
                ipcRenderer.sendSync("createFolder", imageFolder) === "success"
            ) {
                store.dispatch(setImageConfigPath(imageFolder))
            } else {
                alert("Error when creating image folder");
            }
        } else if (imageFolderExists === "exists" && app.config.imagePath === "") {
            store.dispatch(setImageConfigPath(imageFolder))
        }
    } else if (app.os === "MAC") {
        const imageFolder = "/Users/UNAME/Library/Application Support/CloudGameSaveManager/Images".replace(
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
