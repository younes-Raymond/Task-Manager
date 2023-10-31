// headerReducer.js
import { SET_MENU_OPEN } from "../constants/userConstant";


const initialState = {
  isMenuOpen: false, // Initial state
  // other header-related properties...
};


const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_MENU_OPEN':
      return { ...state, isMenuOpen: !state.isMenuOpen }; // Toggle the value
    // Handle other actions here...
    default:
      return state;
  }
};




export default userReducer; // Export the reducer as the default export
