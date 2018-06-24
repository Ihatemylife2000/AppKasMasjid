import { combineReducers } from "redux";
import transactions from "./TransReducer";
import categories from "./CategoriesReducer";
import auth from "./AuthReducer";
import user from "./UserReducer";

export default combineReducers({
  transactions,
  categories,
  auth,
  user
});
