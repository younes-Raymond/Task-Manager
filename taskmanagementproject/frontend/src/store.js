import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { userReducer, menuReducer} from './reducers/userReducer';

const reducer = combineReducers({
    user: userReducer,
    header: menuReducer
    // profile: profileReducer,
    // forgotPassword: forgotPasswordReducer,
    // users: allUsersReducer,
});

let initialState = {
    header: { 
        isMenuOpen: false,
    },
};

const middleware = [thunk];

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;