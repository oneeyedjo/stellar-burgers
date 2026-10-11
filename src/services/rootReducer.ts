import { combineReducers } from '@reduxjs/toolkit';

import { ingredientsReducer } from '../services/ingredientsSlice';
import { userReducer } from '../services/userSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  user: userReducer
});
