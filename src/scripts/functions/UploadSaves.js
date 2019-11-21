// import store from "../../store";
// import { uploading, uploadComplete } from "../../store/actions";
// const { ipcRenderer } = window.require("electron");
// export default function uploadSaves(app, google, username) {
//     store.dispatch(uploading());
//     const games = app.config.games;
//     Object.keys(games).forEach(game => {
//         const output = `/Users/UNAME/Library/Application Support/Cloud-link/files/localArchives/${game}.zip`.replace(
//             "UNAME",
//             username
//         );
//         ipcRenderer.send("", {});
//         ipcRenderer.on("archiveGame", )
//         ipcRenderer.sendSync("archiveGame", {
//             path: app.config.games[game],
//             game: game,
//             write: output
//         });
//         //games are now all archived locally
//         ipcRenderer.sendSync("uploadFile", {
//             title: game,
//             file: `localArchives/${game}.zip`,
//             type: "application/vnd.google-apps.file",
//             parent: google.clGamesFolder,
//             auth: app.authKey,
//             username: username
//         });
//     });
//     store.dispatch(uploadComplete());
// }
