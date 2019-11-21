import {
    TOGGLE_FULLSCREEN,
    SEND_USER_INFO,
    SAVEOS,
    GETDRIVES,
    SAVEAUTHKEY,
    SETLAUNCHERS,
    SET_GAME_PATHS,
    CONFIG_ADD_GAME,
    SET_CONFIG_FILE_PATH,
    SET_BASE_CONFIG,
    SET_CONFIG_GAMES,
    CHANGE_CONFIG_GAME_PATH,
    SET_IMAGE_CONFIG_PATH,
    ADD_NEW_GAME,
    SAVE_CONFIG,
    CONFIG_ADD_IMAGE_PATH,
    SET_TEMP_LOC_PATH

} from "../types";

export const toggleFullscreen = payload => ({
    type: TOGGLE_FULLSCREEN,
    payload
});

export const sendUserInfo = payload => ({
    type: SEND_USER_INFO,
    payload
});

export const saveOS = payload => ({
    type: SAVEOS,
    payload
});

export const getDrives = payload => ({
    type: GETDRIVES,
    payload
});

export const saveAuthKey = payload => ({
    type: SAVEAUTHKEY,
    payload
})

export const setLaunchers = payload => ({
    type: SETLAUNCHERS,
    payload
});

export const setGamePaths = payload => ({
    type: SET_GAME_PATHS,
    payload
});

export const addGameConfig = payload => ({
    type: CONFIG_ADD_GAME,
    payload
});

export const setConfigPath = payload => ({
    type: SET_CONFIG_FILE_PATH,
    payload
});

export const setTempLocPath = payload => ({
    type: SET_TEMP_LOC_PATH,
    payload
});

export const setBaseConfig = payload => ({
    type: SET_BASE_CONFIG,
    payload
});

export const setConfigGames = payload => ({
    type: SET_CONFIG_GAMES,
    payload
});

export const changeConfigGamePath = payload => ({
    type: CHANGE_CONFIG_GAME_PATH,
    payload
});

export const setImageConfigPath = payload => ({
    type: SET_IMAGE_CONFIG_PATH,
    payload
});

export const addNewGame = payload => ({
    type: ADD_NEW_GAME,
    payload
});

export const addImage = payload => ({
    type: CONFIG_ADD_IMAGE_PATH,
    payload
});

export const saveConfig = () => ({
    type: SAVE_CONFIG
});

