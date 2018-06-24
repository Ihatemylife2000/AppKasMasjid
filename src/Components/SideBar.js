import React, { Component } from "react";
import { View, StyleSheet, Platform } from "react-native";
import {
  DrawerItem,
  DrawerSection,
  withTheme,
  Switch,
  TouchableRipple,
  Paragraph,
  Colors,
} from "react-native-paper";
import { logout } from "../Actions";
import { connect } from "react-redux";

const DrawerItemsData = [
  { label: "Transaksi", icon: "account-balance-wallet", screen: "TransStack" },
  { label: "Laporan", icon: "equalizer", screen: "ReportStack" },
  { label: "Kategori", icon: "apps", screen: "CatStack" },
  { label: "Pengurus", icon: "person", screen: "UserStack" },
];

class SideBar extends Component {
  state = {
    open: false,
    drawerItemIndex: 0
  };

  componentDidUpdate(prevProps) {
    const { auth, navigation } = this.props;
    if (auth !== prevProps.auth)
      if (!auth.access_token)
        navigation.navigate("Login");
  }

  _setDrawerItem = (screen, index) => {
    this.props.navigation.navigate(screen);
    this.setState({ drawerItemIndex: index });
  };

  render() {
    const { auth, logout } = this.props;
    return (
      <View style={[styles.drawerContent, { backgroundColor: Colors.white }]}>
        {DrawerItemsData.map((props, index) => (
          (props.key === "UserStack") ? auth.role && auth.role.id === 1 : true &&
            <DrawerItem
              {...props}
              key={index}
              active={this.state.drawerItemIndex === index}
              onPress={() => this._setDrawerItem(props.screen, index)}
            />
        ))}
        <DrawerItem
          label="Keluar"
          icon="power-settings-new"
          onPress={() => logout()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    paddingTop: 25,
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  transactions: state.transactions
});

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(logout())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SideBar);
