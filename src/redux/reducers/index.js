// src/redux/reducers/index.js
import { combineReducers } from 'redux';
import counterReducer from '../slices/counterSlice'; // Assuming you'll create counterSlice

const rootReducer = combineReducers({
  counter: counterReducer,
  // Add other reducers here
});

export default rootReducer;