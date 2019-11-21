import { UPLOADING, UPLOADING_SUCCESS, UPLOADING_FAIL } from "../types";
const { ipcRenderer } = window.require("electron");

export const upload = username => (dispatch, getState) => {
    dispatch({ type: UPLOADING });
    const { appReducer: app, GoogleReducer: google } = getState();
    console.log(getState());
    const games = app.config.games;
    Promise.all(Object.keys(games).map(game => zip(app, game, username)))
        .then(() =>
            Promise.all(
                Object.keys(games).map(game =>
                    doUpload(app, game, google, username)
                )
            )
        )
        .then(() => dispatch(uploadSuccess()))
        .catch(err => dispatch(uploadFail(err)));
};

export const uploadSuccess = () => ({
    type: UPLOADING_SUCCESS
});

export const uploadFail = err => ({
    type: UPLOADING_FAIL,
    payload: err
});

function zip(app, game, username) {
    return new Promise(resolve => {
        ipcRenderer.send("archiveGame", {
            path: app.config.games[game],
            game: game,
            write: `/Users/${username}/Library/Application Support/Cloud-link/files/localArchives/${game}.zip`
        });
        ipcRenderer.on("gameArchived", () => resolve());
    });
}

function doUpload(app, game, google, username) {
    return new Promise((resolve,reject) => {
        ipcRenderer.send("uploadFile", {
            title: game,
            file: `localArchives/${game}.zip`,
            type: "application/vnd.google-apps.file",
            parent: google.clGamesFolder,
            auth: app.authKey,
            username: username
        });
        ipcRenderer.on("uploadComplete", () => resolve());
        ipcRenderer.on("uploadError", (event => reject(event)))
    });
}
