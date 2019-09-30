import {
    OPEN_ADD_GAME_MODEL,
    CLOSE_ADD_GAME_MODEL,
    SET_IMAGE,
    SET_NEW_GAME_PATH
} from "../types";

const initialState = {
    state: false,
    image: "",
    path: ""
};

export default (state = initialState, action) => {
    switch (action.type) {
        case OPEN_ADD_GAME_MODEL:
            return {
                ...state,
                state: true
            };
        case CLOSE_ADD_GAME_MODEL:
            return {
                ...state,
                state: false
            };
        case SET_IMAGE:
            console.log(action)
            return {
                ...state,
                image: action.payload
            };
        case SET_NEW_GAME_PATH:
            return {
                ...state,
                path: action.payload
            };
        default:
            return state;
    }
};
