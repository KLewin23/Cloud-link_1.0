import { OPEN_GAME_MODEL, CLOSE_GAME_MODEL, CHANGE_TITLE, SET_PATH, SET_GAME, SET_NEW_PATH, SET_MODIFY_IMAGE } from "../types";

export const openModal = () => ({
    type: OPEN_GAME_MODEL
});

export const closeModal = () => ({
    type: CLOSE_GAME_MODEL
});

export const setModalTitle = payload => ({
    type: CHANGE_TITLE,
    payload
});

export const setPath = (payload) => ({
    type: SET_PATH,
    payload
});

export const setGame = payload => ({
    type: SET_GAME,
    payload
});

export const setNewPath = payload => ({
    type: SET_NEW_PATH,
    payload
});

export const setModifiedImage = payload => ({
    type: SET_MODIFY_IMAGE,
    payload
});


