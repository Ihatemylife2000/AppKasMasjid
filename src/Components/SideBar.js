import React, { Component } from "react";
import {
  Container,
  Content,
  Text,
  List,
  ListItem,
  Header,
  Icon,
  Left,
} from "native-base";
import { StyleSheet } from "react-native";
import { logout } from "../Actions";
import { connect } from "react-redux";

const routes = [
  { label: "Transaksi", icon: "swap", screen: "Trans" },
  { label: "Laporan", icon: "stats", screen: "Report" },
  { label: "Kategori", icon: "apps", screen: "CategoriesMan" },
  { label: "Pengurus", icon: "people", screen: "User" }
];

class SideBar extends Component {
  componentDidUpdate(prevProps) {
    const { auth, navigation } = this.props;
    if (auth !== prevProps.auth)
      if(!auth.access_token)
        navigation.navigate("Login");
  }

  render() {
    const { navigation, auth, logout, user } = this.props;
    return (
      <Container>
        <Header noShadow span />
        <Content
          bounces={false}
          style={{ flex: 1, top: -1 }}
        >
          <List
            dataArray={routes}
            renderRow={(item, index) =>
              (item.screen === "UserStack" ? auth.role && auth.role.id === 1 : true) &&
                <ListItem
                  button
                  noBorder
                  onPress={() => navigation.navigate(item.screen)}
                  key={index}
                >
                  <Left>
                    <Icon
                      name={item.icon}
                      style={{ color: "#777", fontSize: 26, width: 30 }}
                    />
                    <Text style={styles.text}>
                      {item.label}
                    </Text>
                  </Left>
                </ListItem>
            }
          >
          </List>
          <ListItem
            button
            noBorder
            onPress={() => logout()}>
            <Left>
              <Icon
                name="log-out"
                style={{ color: "#777", fontSize: 26, width: 30 }}
              />
              <Text style={styles.text}>
                Keluar
              </Text>
            </Left>
          </ListItem>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    fontWeight: "400",
    fontSize: 16,
    marginLeft: 20
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "400",
    textAlign: "center",
    marginTop: -3
  }
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  transactions: state.transactions,
  user: state.user
});

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(logout())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SideBar);
