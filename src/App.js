import React, { Component } from "react";
import { Root } from "native-base";
import LoginScreen from "./Components/LoginScreen";
import TransScreen from "./Components/TransScreen";
import UserScreen from "./Components/UserScreen";
import EntryTransScreen from "./Components/EntryTransScreen";
import DetailTransScreen from "./Components/DetailTransScreen";
import EditTransScreen from "./Components/EditTransScreen";
import ReportScreen from "./Components/ReportScreen";
import CategoriesScreen from "./Components/CategoriesScreen";
import CategoriesManScreen from "./Components/CategoriesManScreen";
import EntryCatScreen from "./Components/EntryCatScreen";
import SearchCatScreen from "./Components/SearchCatScreen";
import EntryUserScreen from "./Components/EntryUserScreen";
import DetailUserScreen from "./Components/DetailUserScreen";
import ReportDetailScreen from "./Components/ReportDetailScreen";
import SideBar from "./Components/SideBar";
import {
  StackNavigator,
  SwitchNavigator,
  DrawerNavigator
} from "react-navigation";
import {
  removeTransaction,
  removeUser,
  addTransaction,
  addCategory,
  addUser,
  updateTransaction,
  logout
} from "./Actions";
import Pusher from "pusher-js/react-native";
import { connect } from "react-redux";

const TransStack = StackNavigator(
  {
    Home: { screen: TransScreen },
    Entry: {
      screen: EntryTransScreen,
      navigationOptions: {
        drawerLockMode: "locked-closed"
      }
    },
    Detail: {
      screen: DetailTransScreen,
      navigationOptions: {
        drawerLockMode: "locked-closed"
      }
    },
    Edit: {
      screen: EditTransScreen,
      navigationOptions: {
        drawerLockMode: "locked-closed"
      }
    },
    Category: {
      screen: CategoriesScreen,
      navigationOptions: {
        drawerLockMode: "locked-closed"
      }
    },
    EntryCat: {
      screen: EntryCatScreen,
      navigationOptions: {
        drawerLockMode: "locked-closed"
      }
    },
    SearchCat: {
      screen: SearchCatScreen,
      navigationOptions: {
        drawerLockMode: "locked-closed"
      }
    }
  },
  {
    initialRouteName: "Home",
    headerMode: "none"
  }
);

const CatStack = StackNavigator(
  {
    Home: { screen: CategoriesManScreen },
    Entry: {
      screen: EntryCatScreen,
      navigationOptions: {
        drawerLockMode: "locked-closed"
      }
    }
  },
  {
    initialRouteName: "Home",
    headerMode: "none"
  }
);

const ReportStack = StackNavigator(
  {
    Home: { screen: ReportScreen },
    ReportDetail: {
      screen: ReportDetailScreen,
      navigationOptions: {
        drawerLockMode: "locked-closed"
      }
    },
    Detail: {
      screen: DetailTransScreen,
      navigationOptions: {
        drawerLockMode: "locked-closed"
      }
    },
    Edit: {
      screen: EditTransScreen,
      navigationOptions: {
        drawerLockMode: "locked-closed"
      }
    },
    Category: {
      screen: CategoriesScreen,
      navigationOptions: {
        drawerLockMode: "locked-closed"
      }
    },
    EntryCat: {
      screen: EntryCatScreen,
      navigationOptions: {
        drawerLockMode: "locked-closed"
      }
    },
    SearchCat: {
      screen: SearchCatScreen,
      navigationOptions: {
        drawerLockMode: "locked-closed"
      }
    }
  },
  {
    initialRouteName: "Home",
    headerMode: "none"
  }
);

const UserStack = StackNavigator(
  {
    Home: { screen: UserScreen },
    Entry: {
      screen: EntryUserScreen,
      navigationOptions: {
        drawerLockMode: "locked-closed"
      }
    },
    Detail: {
      screen: DetailUserScreen,
      navigationOptions: {
        drawerLockMode: "locked-closed"
      }
    }
  },
  {
    initialRouteName: "Home",
    headerMode: "none"
  }
);

const MainDrawer = DrawerNavigator(
  {
    TransStack: { screen: TransStack },
    CatStack: { screen: CatStack },
    ReportStack: { screen: ReportStack },
    UserStack: { screen: UserStack }
  },
  {
    contentComponent: props => <SideBar { ...props }/>
  }
);

const MainSwitch = SwitchNavigator(
  {
    Login: { screen: LoginScreen },
    MainDrawer: { screen: MainDrawer }
  },
  {
    initialRouteName: "Login",
    headerMode: "none",
    cardStyle: {
      backgroundColor: "#FFFFFF",
      opacity: 1
    }
  }
);

class App extends Component {
  componentWillMount() {
    const {
      updateTransaction,
      removeTransaction,
      removeUser,
      addTransaction,
      addCategory,
      addUser,
      logout
    } = this.props;

    Pusher.logToConsole = true;

    const pusher = new Pusher("705d4081209442e6e492", {
      cluster: "ap1",
      encrypted: true
    });

    const channel = pusher.subscribe("app-kas-event");
    channel.bind("App\\Events\\AppEvent", data => {
      if(!this.props.auth.access_token)
        return;

      switch(data.command) {
        case "DELETE_TRANS":
          removeTransaction(data.payload.id);
          break;
        case "DELETE_USER":
          if(this.props.auth.role && this.props.auth.role.id === 1)
            removeUser(data.payload.id);
          else if(this.props.auth.role && this.props.auth.role.id === 2)
            logout();
          break;
        case "ADD_TRANS":
          addTransaction(data.payload.data);
          break;
        case "UPDATE_TRANS":
          updateTransaction(data.payload.id, data.payload.data);
          break;
        case "ADD_CATEGORY":
          addCategory(data.payload.data);
          break;
        case "ADD_USER":
          if(this.props.auth.role && this.props.auth.role.id === 1)
            addUser(data.payload.data);
          break;
      }
    });
  }

  render() {
    return (
      <Root>
        <MainSwitch />
      </Root>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

const mapDispatchToProps = dispatch => ({
  removeTransaction: id => dispatch(removeTransaction(id)),
  removeUser: id => dispatch(removeUser(id)),
  addTransaction: data => dispatch(addTransaction(data)),
  addCategory: data => dispatch(addCategory(data)),
  addUser: data => dispatch(addUser(data)),
  updateTransaction: (id, data) => dispatch(updateTransaction(id, data)),
  logout: () => dispatch(logout())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
