import { combineReducers } from '@reduxjs/toolkit';

import { constructorReducer } from '../services/constructorSlice'
import { ingredientsReducer } from '../services/ingredientsSlice';
import { ordersReducer } from './ordersSlice';
import { orderReducer } from './orderSlice';
import { userReducer } from '../services/userSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  user: userReducer,
  orders: ordersReducer,
  constructor: constructorReducer,
  order: orderReducer
});
