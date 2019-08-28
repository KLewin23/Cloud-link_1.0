import store from "../store";
import { setLaunchers } from "../store/actions";
import { setGamePaths } from "../store/actions";
import { GameSavePaths as Games } from "./Games";
import { sysLaunchers as Launchers } from "./Launchers";
import { toggleFullscreen } from "../store/actions/appActions";
import { sendLocation } from "../store/actions";
const { ipcRenderer } = window.require("electron");

export function ScanDrives() {
    //BUG -- skips spanned volumes
    return ipcRenderer.sendSync("getDrives");
}

export function ScanDriveGameLaunchers(username, app) {
    //Takes in system username and the os, runs a function which checks what launchers they have and adds them to redux
    const launchers = Launchers[app.os];
    if (app.os === "WIN") {
        app.drives.forEach(drive => {
            if (drive.mountpoints[0] !== undefined) {
                Object.keys(launchers).forEach(launcher => {

                    console.log(launchers[launcher].replace(
                        "DRIVE",
                        drive.mountpoints[0].path
                    ));
                    console.log(launcher);

                    CheckLocationExistence(
                        launchers[launcher].replace(
                            "DRIVE",
                            drive.mountpoints[0].path
                        ),
                        launcher
                    );
                });
            }
        });
    } else if (app.os === "MAC") {
        Object.keys(launchers).forEach(launcher =>
            CheckLocationExistence(
                launchers[launcher].replace("UNAME", username),
                launcher
            )
        );
    }
}

function CheckLocationExistence(path, launcher) {
    const value = ipcRenderer.sendSync("checkLaunchers", path);
    if (value === "exists") {
        store.dispatch(setLaunchers([launcher, path]));
    }
}

export function GetOs() {

    return new Promise((resolve, reject) => {
        ipcRenderer.send("getOs");
        ipcRenderer.on("returnOs", function(even, data) {
            if (data.includes("MACOS")) {
                resolve("MAC");
            } else if (data.includes("WIN")) {
                resolve("WIN");
            } else {
                reject();
            }
        });
    });
}

export function GetUsername() {
    return ipcRenderer.sendSync("getUsername");
}

export function GetFiles(app, username) {
    const installedGames = app.launchers.reduce((acc, launcher) => {
        const path = launcher[1].replace("UNAME", username);
        const value = ipcRenderer
            .sendSync("getFiles", path)
            .filter(i => !i.startsWith("."));
        return {
            ...acc,
            [launcher[0]]: [value]
        };
    }, {});
    Object.keys(installedGames).forEach(launcher => {
        const gamePaths = installedGames[launcher].reduce(
            (acc, installedGame) => {
                const game = installedGames[launcher]
                    .toString()
                    .toLowerCase();
                const GamesSys = Games[app.os][launcher];
                if (game in GamesSys) {
                    return {
                        ...acc,
                        [game]: GamesSys[game]
                    };
                }
            },
            {}
        );
        store.dispatch(setGamePaths(gamePaths));
    });
}

export function SearchComplete(username) {
    //console.log(ipcRenderer.sendSync("checkLaunchers",`/Users/UNAME/Library/Application\ Support/Steam/steamapps/common/`.replace("UNAME",username)));
    ipcRenderer.send("fill");
}