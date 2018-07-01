import React, { Component } from "react";
import {
  Container,
  Content,
  Button,
  Icon,
  Item,
  Input,
  Text,
  Header,
  Title,
  Left,
  Right,
  Body,
  Card,
  CardItem
} from "native-base";
import { StyleSheet, ToastAndroid } from "react-native";
import { USER_URL } from "../Config/URLs";
import { connect } from "react-redux";
import { logout } from "../Actions";
import axios from "axios";

class EditUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: ""
    };
  }

  componentDidUpdate(prevProps) {
    const { navigation, user } = this.props;
    if (user !== prevProps.user) {
      const id = navigation.getParam("id");
      const data = user.find(data => data.id === id);
      if(!data)
        navigation.pop(2);
    }
  }

  componentDidMount() {
    const { navigation, user } = this.props;
    const id = navigation.getParam("id");
    const data = user.find(data => data.id === id);
    this.setState({...data});
  }

  validateName = () => this.state.name === "";

  validateEmail = () => !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(this.state.email);

  validatePasswordLength = () => this.state.password.length < 6;

  onUpdate = () => {
    const { navigation, auth, logout } = this.props;
    if(this.validateName()) {
      ToastAndroid.show("Nama pengurus tidak boleh kosong", ToastAndroid.SHORT);
      return;
    } else if(this.validateEmail()) {
      ToastAndroid.show("Format email tidak sesuai", ToastAndroid.SHORT);
      return;
    } else if(this.validatePasswordLength()) {
      ToastAndroid.show("Panjang password minimal 6 karakter", ToastAndroid.SHORT);
      return;
    }

    const putData = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password
    };

    const putHeader = {
      headers: {
        Authorization: `Bearer ${auth.access_token}`
      }
    };

    const id = navigation.getParam("id");

    axios.put(`${USER_URL}/${id}`, putData, putHeader)
    .then(response => {
      navigation.goBack();
      ToastAndroid.show("Anda berhasil mengubah pengurus", ToastAndroid.SHORT);
    })
    .catch(error => {
      if(!error.response) {
        ToastAndroid.show("Tidak bisa terhubung ke server", ToastAndroid.SHORT);
      } else if(error.response.status === 401) {
        ToastAndroid.show("Autentikasi gagal", ToastAndroid.SHORT);
        logout();
      }
    });
  };

  render() {
    const { navigation } = this.props;
    return (
      <Container>
        <Header>
          <Left style={{ flex: 1 }}>
            <Button
              onPress={() => navigation.goBack()}
              transparent
              rounded
            >
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body style={{ flex: 3 }}>
            <Title>Ubah Pengurus</Title>
          </Body>
          <Right style={{ flex: 2 }}>
            <Button
              onPress={this.onUpdate}
              hasText
              transparent
            >
              <Text>Simpan</Text>
            </Button>
          </Right>
        </Header>
        <Content>
          <Card style={styles.card}>
            <CardItem>
              <Icon name="person" style={styles.icon} />
              <Item>
                <Input
                  autoCapitalize="none"
                  placeholder="Nama"
                  value={this.state.name}
                  onChangeText={name => this.setState({name})}
                />
              </Item>
            </CardItem>
            <CardItem>
              <Icon name="mail" style={styles.icon} />
              <Item>
                <Input
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="Email"
                  value={this.state.email}
                  onChangeText={email => this.setState({email})}
                />
              </Item>
            </CardItem>
            <CardItem>
              <Icon name="lock" style={styles.icon} />
              <Item>
                <Input
                  autoCapitalize="none"
                  placeholder="Password"
                  value={this.state.password}
                  secureTextEntry
                  onChangeText={password => this.setState({password})}
                />
              </Item>
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    marginTop: 0,
    marginBottom: 15
  },
  icon: {
    width: 30,
    color: "#777"
  }
});

const mapStateToProps = state => ({
  auth: state.auth,
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditUser);
