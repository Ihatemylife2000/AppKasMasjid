import React, { Component } from "react";
import App from "../App";
/*import { StyleProvider } from "native-base";
import kasmasjid from "../../native-base-theme/variables/kasmasjid";
import getTheme from "../../native-base-theme/components";*/
import { Provider as PaperProvider } from "react-native-paper";
import { Provider as StoreProvider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "../Reducers";

const store = createStore(rootReducer);

class Setup extends Component {
  render() {
    return (
      <StoreProvider store={store}>
        <PaperProvider>
          <App/>
        </PaperProvider>
      </StoreProvider>
    );
  }
}

export default Setup;
