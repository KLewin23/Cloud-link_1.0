import {
    SET_CL_MAIN_FOLDER,
    SET_CL_GAMES_FOLDER,
    UPLOADING,
    UPLOADING_SUCCESS,
    UPLOADING_FAIL,
    SET_CL_CONFIG_ID,
    SET_CL_CONFIG,
    ADD_CL_GAMES,
    GAME_CHECK_COMPLETE,
    DOWNLOADING_SAVES,
    DOWNLOAD_FINISHED
} from "../types";

const initialState = {
    clMainFolder: "",
    clGamesFolder: "",
    clUploading: false,
    clDownloading: false,
    clConfigId: "",
    clConfig: {},
    clGames: [],
    clGamesFlag: 0,
    clError: null
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_CL_MAIN_FOLDER:
            return {
                ...state,
                clMainFolder: action.payload
            };
        case SET_CL_GAMES_FOLDER:
            return {
                ...state,
                clGamesFolder: action.payload
            };
        case SET_CL_CONFIG_ID:
            return {
                ...state,
                clConfigId: action.payload
            };
        case SET_CL_CONFIG:
            return {
                ...state,
                clConfig: action.payload
            };

        case UPLOADING:
            return {
                ...state,
                clUploading: true,
                clError: null
            };
        case UPLOADING_SUCCESS:
            return {
                ...state,
                clUploading: false,
                clError: null
            };
        case UPLOADING_FAIL:
            console.log("ERROR", action);
            return {
                ...state,
                clUploading: false,
                clError: action.payload
            };

        case DOWNLOADING_SAVES:
            console.log("downloading");
            return {
                ...state,
                clDownloading: true
            };
        case DOWNLOAD_FINISHED:
            return {
                ...state,
                clDownloading: false
            };
        case ADD_CL_GAMES:
            let games = state.clGames;
            const combined = games.concat(action.payload);
            return {
                ...state,
                clGames: combined
            };
        case GAME_CHECK_COMPLETE:
            return {
                ...state,
                clGamesFlag: 1
            };
        default:
            return state;
    }
};
