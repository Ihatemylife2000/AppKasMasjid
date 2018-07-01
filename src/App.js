import React, { Component } from "react";
import {
  createStackNavigator,
  createSwitchNavigator,
  createDrawerNavigator
} from "react-navigation";
import {
  removeTransaction,
  removeUser,
  addTransaction,
  addCategory,
  addUser,
  updateTransaction,
  updateUser,
  logout
} from "./Actions";
import { connect } from "react-redux";
import { Root } from "native-base";
import CategoriesMan from "./Components/CategoriesMan";
import Categories from "./Components/Categories";
import SearchCat from "./Components/SearchCat";
import EntryCat from "./Components/EntryCat";
import Trans from "./Components/Trans";
import DetailTrans from "./Components/DetailTrans";
import EntryTrans from "./Components/EntryTrans";
import EditTrans from "./Components/EditTrans";
import Report from "./Components/Report";
import DetailReport from "./Components/DetailReport";
import Login from "./Components/Login";
import User from "./Components/User";
import DetailUser from "./Components/DetailUser";
import EntryUser from "./Components/EntryUser";
import EditUser from "./Components/EditUser";
import SideBar from "./Components/SideBar";
import Pusher from "pusher-js/react-native";

const TransStack = createStackNavigator(
  {
    Trans: { screen: Trans },
    Categories: { screen: Categories },
    DetailTrans: { screen: DetailTrans },
    EditTrans: { screen: EditTrans },
    EntryCat: { screen: EntryCat },
    EntryTrans: { screen: EntryTrans },
    SearchCat: { screen: SearchCat }
  },
  {
    headerMode: "none",
    cardStyle: {
      backgroundColor: "#fff",
      opacity: 1
    }
  }
);

const CatManStack = createStackNavigator(
  {
    CategoriesMan: { screen: CategoriesMan },
    EntryCat: { screen: EntryCat }
  },
  {
    headerMode: "none",
    cardStyle: {
      backgroundColor: "#fff",
      opacity: 1
    }
  }
);

const ReportStack = createStackNavigator(
  {
    Report: { screen: Report },
    DetailReport: { screen: DetailReport },
    Categories: { screen: Categories },
    DetailTrans: { screen: DetailTrans },
    EditTrans: { screen: EditTrans },
    EntryCat: { screen: EntryCat },
    EntryTrans: { screen: EntryTrans },
    SearchCat: { screen: SearchCat }
  },
  {
    headerMode: "none",
    cardStyle: {
      backgroundColor: "#fff",
      opacity: 1
    }
  }
);

const UserStack = createStackNavigator(
  {
    User: { screen: User },
    DetailUser: { screen: DetailUser },
    EntryUser: { screen: EntryUser },
    EditUser: { screen: EditUser }
  },
  {
    headerMode: "none",
    cardStyle: {
      backgroundColor: "#fff",
      opacity: 1
    }
  }
);

const Drawer = createDrawerNavigator(
  {
    Trans: { screen: TransStack },
    CategoriesMan: { screen: CatManStack },
    Report: { screen: ReportStack },
    User: { screen: UserStack }
  },
  {
    initialRouteName: "Trans",
    contentComponent: props => <SideBar { ...props }/>
  }
);

const MainNavigator = createSwitchNavigator(
  {
    Login: { screen: Login },
    Drawer: { screen: Drawer }
  },
  {
    initialRouteName: "Login",
    headerMode: "none"
  }
);

class App extends Component {
  componentWillMount() {
    const {
      updateTransaction,
      updateUser,
      removeTransaction,
      removeUser,
      addTransaction,
      addCategory,
      addUser,
      logout
    } = this.props;

    const pusher = new Pusher("705d4081209442e6e492", {
      cluster: "ap1",
      encrypted: true,
      activityTimeout: 60000
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
          removeUser(data.payload.id);
          if(this.props.auth.id === data.payload.id)
            logout();
          break;
        case "ADD_TRANS":
          addTransaction(data.payload.data);
          break;
        case "UPDATE_TRANS":
          updateTransaction(data.payload.data);
          break;
        case "UPDATE_USER":
          updateUser(data.payload.data);
          if(this.props.auth.id === data.payload.id)
            logout();
          break;
        case "ADD_CATEGORY":
          addCategory(data.payload.data);
          break;
        case "ADD_USER":
          addUser(data.payload.data);
          break;
      }
    });
  }

  render() {
    return (
      <Root>
        <MainNavigator />
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
  updateUser: data => dispatch(updateUser(data)),
  updateTransaction: data => dispatch(updateTransaction(data)),
  logout: () => dispatch(logout())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
