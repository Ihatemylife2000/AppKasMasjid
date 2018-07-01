export const setCategory = data => ({
  type: "SET_CATEGORY_LIST",
  payload: { data }
});

export const setTransaction = data => ({
  type: "SET_TRANSACTION_LIST",
  payload: { data }
});

export const setUser = data => ({
  type: "SET_USER_LIST",
  payload: { data }
});

export const addCategory = data => ({
  type: "ADD_CATEGORY",
  payload: { data }
});

export const addUser = data => ({
  type: "ADD_USER",
  payload: { data }
});

export const updateUser = data => ({
  type: "UPDATE_USER",
  payload: { data }
});

export const addTransaction = data => ({
  type: "ADD_TRANSACTION",
  payload: { data }
});

export const removeTransaction = id => ({
  type: "REMOVE_TRANSACTION",
  payload: { id }
});

export const removeUser = id => ({
  type: "REMOVE_USER",
  payload: { id }
});

export const updateTransaction = data => ({
  type: "UPDATE_TRANSACTION",
  payload: { data }
});

export const loginSuccess = auth => ({
  type: "LOGIN_SUCCESS",
  payload: { auth }
});

export const loginRequest = (email, password) => ({
  type: "LOGIN_REQUEST",
  payload: { email, password }
});

export const loginFailure = () => ({
  type: "LOGIN_FAILURE"
});

export const logout = () => ({
  type: "LOGOUT"
});
