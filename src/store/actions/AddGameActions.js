import {
    OPEN_ADD_GAME_MODEL,
    CLOSE_ADD_GAME_MODEL
} from '../types';

export const openAddGame = payload => ({
    type: OPEN_ADD_GAME_MODEL
});

export const closeAddGame = payload => ({
    type: CLOSE_ADD_GAME_MODEL
});