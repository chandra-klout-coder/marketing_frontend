// authReducer.js

import { LOGIN_SUCCESS, LOGOUT_SUCCESS } from "./authActions";

const initialState = {
  isAuthenticated: !!localStorage.getItem("auth_token"),
  token: localStorage.getItem("auth_token") || null,
  userId: "",
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      
      localStorage.setItem("auth_token", action.payload.result.token);

      localStorage.setItem("userId", action.payload.result.user._id);

      return {
        ...state,
        isAuthenticated: true,
        token: action.payload.result.token,
        userId: action.payload.result.user._id,
      };

    case LOGOUT_SUCCESS:
      localStorage.removeItem("auth_token");
      return {
        ...state,
        isAuthenticated: false,
        token: null,
        userId: "",
      };
    default:
      return state;
  }
};

export default authReducer;
