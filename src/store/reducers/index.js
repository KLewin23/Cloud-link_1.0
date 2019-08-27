import { combineReducers } from 'redux';
import scannerReducer from './ScannerReducer.js';
import appReducer from './appReducer';

export default combineReducers({
  scannerReducer,
  appReducer
});
