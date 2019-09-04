import { combineReducers } from 'redux';
import scannerReducer from './ScannerReducer.js';
import appReducer from './appReducer';
import GameModalReducer from "./GameModalReducer";

export default combineReducers({
  scannerReducer,
  appReducer,
  GameModalReducer
});
