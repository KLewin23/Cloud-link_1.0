import request from "request";
import store from "../../store";
import { downloadFinished, downloadSaves } from "../../store/actions";
const { ipcRenderer } = window.require("electron");
export default function DownloadAllSaves(google, app) {
    console.log("xx")
    const downloadProg = ipcRenderer.sendSync("downloadFile2",{path: app.config.tempLoc, games: google.clGames, auth: app.authKey});
    console.log(downloadProg)
    // google.clGames.forEach(game => {
    //     request.get(
    //         `https://www.googleapis.com/drive/v2/files/${game.id}`,
    //         {
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 Authorization: `Bearer ${app.authKey}`
    //             },
    //             json: true
    //         },
    //         (err, response) => {
    //             if (err) throw err;
    //             if (response.body.downloadUrl) {
    //                 const value = ipcRenderer.sendSync("downloadFile", {
    //                     url: response.body.downloadUrl,
    //                     path: app.config.tempLoc,
    //                     game: game.name,
    //                     auth: app.authKey
    //                 });
    //             } else {
    //                 console.log(null);
    //             }
    //         }
    //     );
    // })
    //console.log("xxtest")
}
