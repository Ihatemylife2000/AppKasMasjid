import { AsyncStorage } from "react-native";

const INIT_STATE = {
  id: -1,
  name: "",
  email: "",
  role: undefined,
  access_token: "",
  loading: true
};

const auth = (state = INIT_STATE, action) => {
  switch(action.type) {
    case "LOGIN_REQUEST":
      return {...state, loading: true};
    case "LOGIN_SUCCESS":
      AsyncStorage.setItem("auth", JSON.stringify(action.payload.auth));
      return {...state, ...action.payload.auth};
    case "LOGIN_FAILURE":
      return {...state, loading: false};
    case "LOGOUT":
      AsyncStorage.clear();
      return {...INIT_STATE};
    default:
      return state;
  }
};

export default auth;
