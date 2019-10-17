import { combineReducers } from 'redux';
import scannerReducer from './ScannerReducer.js';
import appReducer from './appReducer';
import GameModalReducer from "./GameModalReducer";
import AddGameReducer from "./AddGameReducer";
import GoogleReducer from "./GoogleReducer";

export default combineReducers({
  scannerReducer,
  appReducer,
  GameModalReducer,
  AddGameReducer,
  GoogleReducer
});
