import { AsyncStorage } from "react-native";

const transactions = (state = [], action) => {
  switch(action.type) {
    case "SET_TRANSACTION_LIST":
      AsyncStorage.setItem("transactions", JSON.stringify(action.payload.data));
      return [...action.payload.data];
    case "ADD_TRANSACTION":
      const add = [
        ...state,
        action.payload.data
      ];
      AsyncStorage.setItem("transactions", JSON.stringify(add));
      return add
    case "REMOVE_TRANSACTION":
      const remove = state.filter(trans => trans.id !== action.payload.id);
      AsyncStorage.setItem("transactions", JSON.stringify(remove));
      return remove;
    case "UPDATE_TRANSACTION":
      const update = state.map(trans =>
        trans.id === action.payload.id
          ? {...trans, ...action.payload.data}
          : trans
      );
      AsyncStorage.setItem("transactions", JSON.stringify(update));
      return update;
    default:
      return state;
  }
};

export default transactions;
