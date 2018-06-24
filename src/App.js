import React, { Component } from "react";
import { Root } from "native-base";
import Login from "./Components/Login";
import Trans from "./Components/Trans";
import User from "./Components/User";
import EntryTrans from "./Components/EntryTrans";
import DetailTrans from "./Components/DetailTrans";
import EditTrans from "./Components/EditTrans";
import Report from "./Components/Report";
import Categories from "./Components/Categories";
import CategoriesMan from "./Components/CategoriesMan";
import EntryCat from "./Components/EntryCat";
import SearchCat from "./Components/SearchCat";
import EntryUser from "./Components/EntryUser";
import DetailUser from "./Components/DetailUser";
import DetailReport from "./Components/DetailReport";
import SideBar from "./Components/SideBar";
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
  logout
} from "./Actions";
import Pusher from "pusher-js/react-native";
import { connect } from "react-redux";

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
    EntryUser: { screen: EntryUser }
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
  updateTransaction: (id, data) => dispatch(updateTransaction(id, data)),
  logout: () => dispatch(logout())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
