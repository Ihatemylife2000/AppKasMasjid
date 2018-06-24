import React, { Component } from "react";
import {
  Container,
  Content,
  Button,
  Icon,
  Item,
  Input,
  Form,
  Text,
  Spinner,
  Header,
  Title,
  Body,
  Left,
  Right
} from "native-base";
import { StyleSheet, AsyncStorage, ToastAndroid } from "react-native";
import axios from "axios";
import { LOGIN_URL } from "../Config/URLs";
import { loginRequest, loginSuccess, loginFailure } from "../Actions";
import { connect } from "react-redux";

class Login extends Component {
  state = {
    email: "",
    password: ""
  };

  componentDidMount() {
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

  componentDidUpdate(prevProps) {
    const { auth, navigation } = this.props;
    if (auth !== prevProps.auth)
      if(auth.access_token)
        navigation.navigate("Drawer");
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

  loginForm() {
    const { auth } = this.props;
    return (
      <Container style={styles.container}>
        <Content>
          {auth.loading ?
            <Spinner color="#527A52" /> :
            <Form>
              <Item style={styles.mb20}>
                <Icon name="mail" style={styles.primary} />
                <Input
                  autoCapitalize="none"
                  placeholder="Email"
                  keyboardType="email-address"
                  value={this.state.email}
                  onChangeText={email => this.setState({email})}
                />
              </Item>
              <Item style={styles.mb20}>
                <Icon name="lock" style={styles.primary} />
                <Input
                  autoCapitalize="none"
                  placeholder="Password"
                  secureTextEntry
                  value={this.state.password}
                  onChangeText={password => this.setState({password})}
                />
              </Item>
              <Button
                full
                primary
                onPress={this.onLogin}
              >
                <Text>Masuk</Text>
              </Button>
            </Form>}
        </Content>
      </Container>
    );
  }

  render() {
    return (
      <Container>
        <Header style={{ height: 0 }}/>
        {this.loginForm()}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 30,
    paddingRight: 30
  },
  mb20: {
    marginBottom: 20
  },
  primary: {
    color: "#527A52"
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
)(Login);
