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
    SET_CONFIG_FILE_PATH
} from "../types";

const initialState = {
    config: {
        filePath: "",
        games: {}
    },
    fullscreen: 0,
    loggedIn: 0,
    email: "",
    id: "",
    location: "Home",
    os: "",
    drives: {},
    launchers: [],
    games: {},
    gamePaths: {}
};

export default (state = initialState, action) => {
    switch (action.type) {
        case TOGGLE_FULLSCREEN:
            if (state.fullscreen === 1) {
                return {
                    ...state,
                    fullscreen: 0
                };
            } else {
                return {
                    ...state,
                    fullscreen: 1
                };
            }
        case TOGGLE_USER_STATUS:
            if (state.loggedIn === 1) {
                return {
                    ...state,
                    loggedIn: 0
                };
            } else {
                return {
                    ...state,
                    loggedIn: 1
                };
            }
        case SEND_USER_INFO:
            return {
                ...state,
                email: action.payload[0],
                id: action.payload[1]
            };
        case SEND_LOCATION:
            return {
                ...state,
                location: action.payload
            };
        case SAVEOS:
            return {
                ...state,
                os: action.payload
            };
        case GETDRIVES:
            return {
                ...state,
                drives: action.payload
            };
        case SETLAUNCHERS:
            const curLaunchers = state.launchers
            curLaunchers.push([action.payload[0],action.payload[1]]);
            return {
                ...state,
                launchers: curLaunchers
            };
        case SET_GAME_PATHS:
            return {
                ...state,
                gamePaths: action.payload
            };
        case CONFIG_ADD_GAME:
            return {
                ...state,
                config:{
                    ...state.config,
                    games:{
                        ...state.config.games,
                        [action.payload.name]: action.payload.path
                    }
                }
            };
        case SET_CONFIG_FILE_PATH:
            return {
                ...state,
                config:{
                    ...state.config,
                    filePath: action.payload
                }
            };
        default:
            return state;
    }
};
