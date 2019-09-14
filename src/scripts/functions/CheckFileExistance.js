const { ipcRenderer } = window.require("electron");

export default function checkFileExistance(path){
    const value = ipcRenderer.sendSync("checkLocationExists", path);
    return (value === "exists")? "exists" : "not exists";
}