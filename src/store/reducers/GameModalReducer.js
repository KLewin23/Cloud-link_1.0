import {
    OPEN_GAME_MODEL,
    CLOSE_GAME_MODEL,
    CHANGE_TITLE,
    SET_GAME,
    SET_PATH,
    SET_NEW_PATH,
    SET_MODIFY_IMAGE
} from "../types";

const initialState = {
    state: false,
    currentPath: "",
    currentGame: "",
    newPath: "",
    image: ""
};

export default (state = initialState, action) => {
    switch (action.type) {
        case OPEN_GAME_MODEL:
            return {
                ...state,
                state: true
            };
        case CLOSE_GAME_MODEL:
            return {
                ...state,
                state: false,
                currentPath: "",
                currentGame: "",
                newPath: ""
            };
        case CHANGE_TITLE:
            return {
                ...state,
                title: action.payload.title
            };
        case SET_GAME:
            return {
                ...state,
                currentGame: action.payload
            };
        case SET_PATH:
            return {
                ...state,
                currentPath: action.payload
            };
        case SET_NEW_PATH:
            return {
                ...state,
                newPath: action.payload
            };
        case SET_MODIFY_IMAGE:
            console.log(action.payload)
            return {
                ...state,
                image: action.payload
            }
        default:
            return state;
    }
};
