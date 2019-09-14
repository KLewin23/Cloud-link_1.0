import CheckFileExistance from "./functions/CheckFileExistance";
const { ipcRenderer } = window.require("electron");

export function ConfigMain(app, username) {
    if (app.os === "WIN") {
        const saveLocation = CheckFileExistance(
            "C:\\Users\\USER\\AppData\\Local\\CloudGameSaveManager\\config.json"
        ).replace("USER", username);
    } else if (app.os === "MAC") {
        const saveLocation = CheckFileExistance(
            "/Users/UNAME/Library/Application Support/CloudGameSaveManager/config.json".replace(
                "UNAME",
                username
            )
        );
        if (saveLocation !== "exists") {
            const response = ipcRenderer.sendSync("createFile", {
                name: "/Users/UNAME/Library/Application Support/CloudGameSaveManager/config.json".replace(
                    "UNAME",
                    username
                ),
                contents: JSON.stringify(app.config)
            });
            console.log(response);
            //set path in redux
        }
    } else if (app.os === "LIN") {
        const saveLocation = CheckFileExistance(
            "~/.config/CloudGameSaveManager/config.json"
        );
    } else {
        console.log("Error: OS does not conform to requirements");
    }
}

export function updateFile(app, username) {
    ipcRenderer.sendSync("overwriteFile", {
        name: app.config.path,
        contents: JSON.stringify(app.config)
    });
}
