const { ipcRenderer } = window.require("electron");
export default function uploadSaves(app, username) {
    console.log(app.config.games)
    const games = app.config.games;
    Object.keys(games).forEach(game => {
        const output = `/Users/UNAME/Library/Application Support/Cloud-link/files/localArchives/${game}.zip`.replace(
            "UNAME",
            username
        );
        ipcRenderer.sendSync("archiveGame", {
            path: app.config.games[game],
            game: game,
            write: output
        });
    });
}
