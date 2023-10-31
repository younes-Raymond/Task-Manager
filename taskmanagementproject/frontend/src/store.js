// store.js
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { productListReducer, productDetailsReducer, /* other reducers... */ } from './reducers/productReducer';
import userReducer from './reducers/userReducer'; // Import your header reducer without destructuring

const reducer = combineReducers({
  productDetails: productDetailsReducer,
  products: productListReducer,
  // other reducers...
  header: userReducer, // Include your header reducer as part of the root reducer
});

const initialState = {
  // initial state for other parts of your application...
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
