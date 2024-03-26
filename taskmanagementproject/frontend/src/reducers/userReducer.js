import {
    LOGIN_USER_REQUEST,
    LOGIN_USER_SUCCESS,
    LOAD_USER_REQUEST,
    REGISTER_USER_FAIL,
    REGISTER_USER_REQUEST,
    REGISTER_USER_SUCCESS,
    LOAD_USER_SUCCESS,
    LOGOUT_USER_SUCCESS,
    LOGIN_USER_FAIL,
    LOAD_USER_FAIL,
    LOGOUT_USER_FAIL,
    CLEAR_ERRORS,
  } from '../constants/userConstant';
  
  const initialState = {
    isMenuOpen: false,
    user: {},
    loading: false,
    isAuthenticated: false,
    error: null,
  };
  
  const storedUser = JSON.parse(localStorage.getItem('user'));
  
  const persistedState = storedUser
    ? {
        ...initialState,
        isAuthenticated: true,
        user: storedUser,
      }
    : initialState;
  
  export const userReducer = (state = persistedState, { type, payload }) => {
    switch (type) {
      case LOGIN_USER_REQUEST:
      case REGISTER_USER_REQUEST:
      case LOAD_USER_REQUEST:
        return {
          ...state,
          loading: true,
          isAuthenticated: false,
        };
      case LOGIN_USER_SUCCESS:
      case REGISTER_USER_SUCCESS:
      case LOAD_USER_SUCCESS:
        localStorage.setItem('user', JSON.stringify(payload));
        return {
          ...state,
          loading: false,
          isAuthenticated: true,
          user: payload,
        };
      case LOGOUT_USER_SUCCESS:
        localStorage.removeItem('user');
        return {
          ...state,
          loading: false,
          user: null,
          isAuthenticated: false,
        };
      case LOGIN_USER_FAIL:
      case REGISTER_USER_FAIL:
        return {
          ...state,
          loading: false,
          isAuthenticated: false,
          user: null,
          error: payload,
        };
      case LOAD_USER_FAIL:
        return {
          ...state,
          loading: false,
          isAuthenticated: false,
          user: null,
          error: payload,
        };
      case LOGOUT_USER_FAIL:
        return {
          ...state,
          loading: false,
          error: payload,
        };
      case CLEAR_ERRORS:
        return {
          ...state,
          error: null,
        };
      default:
        return state;
    }
  };
  
  export const menuReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_MENU_OPEN':
        return { ...state, isMenuOpen: !state.isMenuOpen };
      default:
        return state;
    }
  };
  