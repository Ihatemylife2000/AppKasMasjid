import React, { Component } from "react";
import { StyleSheet, AsyncStorage, ToastAndroid, View } from "react-native";
import axios from "axios";
import { LOGIN_URL } from "../Config/URLs";
import { loginRequest, loginSuccess, loginFailure } from "../Actions";
import { Button, Card, FAB, TextInput, Toolbar, ToolbarBackAction, ToolbarContent, ToolbarAction, Colors } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import { connect } from "react-redux";

class LoginScreen extends Component {
  state = {
    email: "",
    password: ""
  };

  componentDidUpdate(prevProps) {
    const { auth, navigation } = this.props;
    if (auth !== prevProps.auth)
      if (auth.access_token)
        navigation.navigate("MainDrawer");
  }

  componentWillMount() {
    const { authSuccess, authFailure } = this.props;
    AsyncStorage.getItem("auth").then(user => {
      if(user) {
        user = JSON.parse(user);
        authSuccess(user);
      } else {
        authFailure(user);
      }
    }).done();
  }

  onLogin = () => {
    const { authRequest, authSuccess, authFailure } = this.props;

    authRequest(this.state.email, this.state.password);

    const postData = {
      email: this.state.email,
      password: this.state.password
    };

    axios.post(LOGIN_URL, postData)
    .then(response => {
      authSuccess(response.data);
      ToastAndroid.show("Anda berhasil login", ToastAndroid.SHORT);
    })
    .catch(error => {
      authFailure();
      if(!error.response) {
        ToastAndroid.show("Tidak bisa terhubung ke server", ToastAndroid.SHORT);
      } else {
        ToastAndroid.show("Email atau Password salah", ToastAndroid.SHORT);
      }
    });
  }

  render() {
    const { auth } = this.props;
    return (
      <View style={styles.container}>
        <Toolbar>
          <ToolbarContent title="Login" />
        </Toolbar>
          <View style={styles.row}>
            <View style={styles.input}>
              <TextInput
                autoCapitalize="none"
                placeholder="Email"
                keyboardType="email-address"
                value={this.state.email}
                onChangeText={email => this.setState({email})}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.input}>
              <TextInput
                autoCapitalize="none"
                placeholder="Password"
                secureTextEntry
                value={this.state.password}
                onChangeText={password => this.setState({password})}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.input}>
              <Button raised primary onPress={this.onLogin}>
                Masuk
              </Button>
            </View>
          </View>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white
  },
  input: {
    flex: 1,
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    padding: 8,
  },
  form: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 30,
    paddingRight: 30
  }
});

const mapStateToProps = state => ({
  auth: state.auth
});

const mapDispatchToProps = dispatch => ({
  authRequest: (email, password) => dispatch(loginRequest(email, password)),
  authSuccess: auth => dispatch(loginSuccess(auth)),
  authFailure: () => dispatch(loginFailure())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginScreen);
