import {
    SET_CL_MAIN_FOLDER,
    SET_CL_GAMES_FOLDER,
    UPLOADING_GAMES,
    UPLOAD_FINISHED,
    SET_CL_CONFIG_ID,
    SET_CL_CONFIG, ADD_CL_GAMES
} from "../types";

const initialState = {
    clMainFolder: "",
    clGamesFolder: "",
    clUploading: false,
    clConfigId: "",
    clConfig: {},
    clGames: []
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
            console.log(action.payload);
            return {
                ...state,
                clConfig: action.payload
            };
        case UPLOADING_GAMES:
            return {
                ...state,
                clUploading: true
            };
        case UPLOAD_FINISHED:
            return {
                ...state,
                clUploading: false
            };
        case ADD_CL_GAMES:
            let games = state.clGames;
            const combined = games.concat(action.payload);
            return {
                ...state,
                clGames: combined
            };
        default:
            return state;
    }
};
