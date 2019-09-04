import { ADD_MESSAGE } from '../types';

const initialState = {
  progressMessages:{}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_MESSAGE:
      var launcher  = action.payload.launcher
      var message = action.payload.message
      var curProgMessages = state.progressMessages
      curProgMessages[launcher] = message
      return {
        ...state,
        progressMessages: curProgMessages,
      };
    default:
      return state;
  }
};
