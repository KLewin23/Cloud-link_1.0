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
    CONFIG_ADD_IMAGE_PATH
} from "../types";
import { updateFile } from "../../scripts/ConfigHandler";
import { GetUsername } from "../../scripts/Scanner";

const initialState = {
    config: {
        filePath: "",
        imagePath: "",
        games: {},
        images: {}
    },
    fullscreen: 0,
    authKey: "",
    email: "",
    id: "",
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
        case SEND_USER_INFO:
            return {
                ...state,
                email: action.payload[0],
                id: action.payload[1]
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
        case SAVEAUTHKEY :
            return {
                ...state,
                authKey: action.payload
            };
        case SETLAUNCHERS:
            const curLaunchers = state.launchers;
            curLaunchers.push([action.payload[0], action.payload[1]]);
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
            updateFile(
                {
                    ...state,
                    config: {
                        ...state.config,
                        games: {
                            ...state.config.games,
                            [action.payload.name]: action.payload.path
                        }
                    }
                },
                GetUsername()
            );
            return {
                ...state,
                config: {
                    ...state.config,
                    games: {
                        ...state.config.games,
                        [action.payload.name]: action.payload.path
                    }
                }
            };
        case SET_BASE_CONFIG:
            return {
                ...state,
                config: JSON.parse(action.payload)
            };
        case SET_CONFIG_GAMES:
            return {
                ...state,
                config: {
                    ...state.config,
                    games: action.payload
                }
            };
        case SET_CONFIG_FILE_PATH:
            updateFile(
                {
                    ...state,
                    config: {
                        ...state.config,
                        filePath: action.payload
                    }
                },
                GetUsername()
            );
            return {
                ...state,
                config: {
                    ...state.config,
                    filePath: action.payload
                }
            };
        case CHANGE_CONFIG_GAME_PATH:
            updateFile(
                {
                    ...state,
                    config: {
                        ...state.config,
                        games: {
                            ...state.config.games,
                            [action.payload.name]: action.payload.path
                        }
                    }
                },
                GetUsername()
            );
            return {
                ...state,
                config: {
                    ...state.config,
                    games: {
                        ...state.config.games,
                        [action.payload.name]: action.payload.path
                    }
                }
            };
        case SET_IMAGE_CONFIG_PATH:
            updateFile(
                {
                    ...state,
                    config: {
                        ...state.config,
                        imagePath: action.payload
                    }
                },
                GetUsername()
            );
            return {
                ...state,
                config: {
                    ...state.config,
                    imagePath: action.payload
                }
            };
        case ADD_NEW_GAME:
            updateFile(
                {
                    ...state,
                    config: {
                        ...state.config,
                        games: {
                            ...state.config.games,
                            [action.payload.name]: action.payload.path
                        },
                        images: {
                            ...state.config.images,
                            [action.payload.name]: action.payload.image
                        }
                    },
                    gamePaths: {
                        ...state.gamePaths,
                        [action.payload.name]: action.payload.path
                    }
                },
                GetUsername()
            );
            return {
                ...state,
                config: {
                    ...state.config,
                    games: {
                        ...state.config.games,
                        [action.payload.name]: action.payload.path
                    },
                    images: {
                        ...state.config.images,
                        [action.payload.name]: action.payload.image
                    }
                },
                gamePaths: {
                    ...state.gamePaths,
                    [action.payload.name]: action.payload.path
                }
            };
        case SAVE_CONFIG:
            console.log({...state});
            updateFile(
                {
                    ...state
                },
                GetUsername()
            );
            return { ...state };
        case CONFIG_ADD_IMAGE_PATH:
            updateFile(
                {
                    ...state,
                    config: {
                        ...state.config,
                        images: {
                            ...state.config.images,
                            [action.payload.name]: action.payload.path
                        }
                    }
                },
                GetUsername()
            );
            return {
                ...state,
                config: {
                    ...state.config,
                    images: {
                        ...state.config.images,
                        [action.payload.name]: action.payload.path
                    }
                }
            };
        default:
            return state;
    }
};
