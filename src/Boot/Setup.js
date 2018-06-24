import React, { Component } from "react";
import App from "../App";
import { StyleProvider } from "native-base";
import kasmasjid from "../../native-base-theme/variables/kasmasjid";
import getTheme from "../../native-base-theme/components";
import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "../Reducers";

const store = createStore(rootReducer);

class Setup extends Component {
  render() {
    return (
      <Provider store={store}>
        <StyleProvider style={getTheme(kasmasjid)}>
          <App/>
        </StyleProvider>
      </Provider>
    );
  }
}

export default Setup;
