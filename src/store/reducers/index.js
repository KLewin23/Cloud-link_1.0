import { combineReducers } from 'redux';
import drivecheckReducer from './DriveCheckReducer.js';
import appReducer from './appReducer';

export default combineReducers({
  drivecheckReducer,
  appReducer
});
