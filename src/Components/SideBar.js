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
  Thumbnail,
  Body
} from "native-base";
import { StyleSheet } from "react-native";
import { connect } from "react-redux";
import { logout } from "../Actions";

const routes = [
  { label: "Transaksi", icon: "swap", screen: "Trans" },
  { label: "Laporan", icon: "stats", screen: "Report" },
  { label: "Kategori", icon: "apps", screen: "CategoriesMan" },
  { label: "Pengurus", icon: "people", screen: "User" },
  { label: "Keluar", icon: "log-out", screen: "Login" }
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
        <Header noShadow span>
          <Body>
            <Thumbnail
              large
              square
              style={{ alignSelf: "center" }}
              source={require("./circle_mosque.png")}
            />
          </Body>
        </Header>
        <Content
          bounces={false}
          style={{ flex: 1, top: -1 }}
        >
          <List
            dataArray={routes}
            renderRow={(item, index) =>
              (item.screen === "User" ? auth.role && auth.role.id === 1 : true) &&
                <ListItem
                  button
                  noBorder
                  onPress={() => {
                    if(item.screen === "Login")
                      logout();
                    else
                      navigation.navigate(item.screen);
                  }}
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
