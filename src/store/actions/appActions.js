import {
    TOGGLE_FULLSCREEN,
    TOGGLE_USER_STATUS,
    SEND_USER_INFO,
    SEND_LOCATION,
    SAVEOS,
    GETDRIVES,
    SETLAUNCHERS,
    SET_GAME_PATHS,
    CONFIG_ADD_GAME,
    SET_CONFIG_FILE_PATH,
    SET_BASE_CONFIG,
    SET_CONFIG_GAMES,
    CHANGE_CONFIG_GAME_PATH,
    SET_IMAGE_CONFIG_PATH,
    ADD_NEW_GAME,

} from "../types";

export const toggleFullscreen = payload => ({
    type: TOGGLE_FULLSCREEN,
    payload
});

export const toggleUserStatus = payload => ({
    type: TOGGLE_USER_STATUS,
    payload
});

export const sendUserInfo = payload => ({
    type: SEND_USER_INFO,
    payload
});

export const sendLocation = payload => ({
    type: SEND_LOCATION,
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

