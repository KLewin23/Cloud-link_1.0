import {
    SET_CL_MAIN_FOLDER,
    SET_CL_GAMES_FOLDER,
    UPLOADING_GAMES,
    UPLOAD_FINISHED,
    SET_CL_CONFIG_ID,
    SET_CL_CONFIG,
    ADD_CL_GAMES,
    GAME_CHECK_COMPLETE,
} from "../types";

export const setClMainFolder = payload => ({
    type: SET_CL_MAIN_FOLDER,
    payload
});

export const setClGamesFolder = payload => ({
    type: SET_CL_GAMES_FOLDER,
    payload
});

export const setClConfigId = payload => ({
    type: SET_CL_CONFIG_ID,
    payload
});

export const setClConfig = payload => ({
    type: SET_CL_CONFIG,
    payload
});

export const uploading = payload => ({
    type: UPLOADING_GAMES,
    payload
});

export const uploadComplete = payload => ({
    type: UPLOAD_FINISHED,
    payload
});

export const addGames = payload => ({
    type: ADD_CL_GAMES,
    payload
});

export const clGameCheckComplete = payload => ({
    type: GAME_CHECK_COMPLETE
});
