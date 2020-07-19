import { combineReducers } from 'redux';

import loginUser from './loginUser';
import topic from './topic';
import cartInfo from './cartInfo';
import filter from './Filter';

export default combineReducers({loginUser, topic, cartInfo, filter});