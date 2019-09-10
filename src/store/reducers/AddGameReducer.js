import {
    OPEN_ADD_GAME_MODEL,
    CLOSE_ADD_GAME_MODEL
} from "../types";

const initialState = {
    state: false,
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
        default:
            return state;
    }
};
