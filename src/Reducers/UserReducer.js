import { AsyncStorage } from "react-native";

const user = (state = [], action) => {
  switch(action.type) {
    case "SET_USER_LIST":
      AsyncStorage.setItem("user", JSON.stringify(action.payload.data));
      return [...action.payload.data];
    case "ADD_USER":
      const add = [
        ...state,
        action.payload.data
      ];
      AsyncStorage.setItem("user", JSON.stringify(add));
      return add
    case "REMOVE_USER":
      const remove = state.filter(user => user.id !== action.payload.id);
      AsyncStorage.setItem("user", JSON.stringify(remove));
      return remove;
    case "UPDATE_USER":
      const update = state.map(user =>
        user.id === action.payload.id
          ? {...user, ...action.payload.data}
          : user
      );
      AsyncStorage.setItem("user", JSON.stringify(update));
      return update;
    default:
      return state;
  }
};

export default user;
