import { AsyncStorage } from "react-native";

const user = (state = [], action) => {
  switch(action.type) {
    case "SET_USER_LIST":
      AsyncStorage.setItem("user", JSON.stringify(action.payload.data));
      return [...action.payload.data];
    case "ADD_USER":
      if(state.find(user => user.id === action.payload.data.id))
        return state;
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
      const list_id = action.payload.data.map(user => user.id);
      const update = state.map(user =>
        list_id.includes(user.id)
          ? {...user, ...action.payload.data.find(data => data.id === user.id)}
          : user
      );
      AsyncStorage.setItem("user", JSON.stringify(update));
      return update;
    default:
      return state;
  }
};

export default user;
