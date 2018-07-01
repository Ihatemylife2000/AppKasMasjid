import { AsyncStorage } from "react-native";

const categories = (state = [], action) => {
  switch(action.type) {
    case "SET_CATEGORY_LIST":
      AsyncStorage.setItem("categories", JSON.stringify(action.payload.data));
      return [...action.payload.data];
    case "ADD_CATEGORY":
      if(state.find(cat => cat.id === action.payload.data.id))
        return state;
      const add = [
        ...state,
        action.payload.data
      ];
      AsyncStorage.setItem("categories", JSON.stringify(add));
      return add;
    /*case "REMOVE_CATEGORY":
      return state.filter(cat => cat.id !== action.payload.id);
    case "UPDATE_CATEGORY":
      return state.map(cat =>
        cat.id === action.payload.id
          ? {...cat, ...action.payload.data}
          : cat
      );*/
    default:
      return state;
  }
};

export default categories;
