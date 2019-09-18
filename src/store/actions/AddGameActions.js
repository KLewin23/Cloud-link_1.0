import {
    OPEN_ADD_GAME_MODEL,
    CLOSE_ADD_GAME_MODEL,
    SET_IMAGE,
    SET_NEW_GAME_PATH
} from "../types";

export const openAddGame = payload => ({
    type: OPEN_ADD_GAME_MODEL
});

export const closeAddGame = payload => ({
    type: CLOSE_ADD_GAME_MODEL
});

export const setImage = payload => ({
    type: SET_IMAGE,
    payload
});

export const setGamePath = payload => ({
    type: SET_NEW_GAME_PATH,
    payload
});
