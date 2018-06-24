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
import {
  TouchableNativeFeedback,
  StyleSheet,
  DatePickerAndroid,
  ToastAndroid
} from "react-native";
import dateFormat from "dateformat";
import axios from "axios";
import { USER_URL } from "../Config/URLs";
import { connect } from "react-redux";

class EntryUser extends Component {
  state = {
    name: "",
    email: "",
    password: "",
    c_password: ""
  };

  validateName = () => this.state.name === "";

  validateEmail = () => !/[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm.test(this.state.email);

  validatePasswordLength = () => this.state.password.length < 6;

  validatePassword = () => this.state.password !== this.state.c_password;

  onPost = () => {
    const { navigation, auth } = this.props;
    if(this.validateName()) {
      ToastAndroid.show("Nama pengurus tidak boleh kosong", ToastAndroid.SHORT);
      return;
    } else if(this.validateEmail()) {
      ToastAndroid.show("Format email tidak sesuai", ToastAndroid.SHORT);
      return;
    } else if(this.validatePasswordLength()) {
      ToastAndroid.show("Panjang password minimal 6 karakter", ToastAndroid.SHORT);
      return;
    } else if(this.validatePassword()) {
      ToastAndroid.show("Konfirmasi password tidak cocok", ToastAndroid.SHORT);
      return;
    }

    const postData = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      c_password: this.state.c_password
    };

    const postHeader = {
      headers: {
        Authorization: `Bearer ${auth.access_token}`
      }
    };

    axios.post(USER_URL, postData, postHeader)
    .then(response => {
      navigation.goBack();
      ToastAndroid.show("Anda berhasil menambahkan pengurus", ToastAndroid.SHORT);
    })
    .catch(error => {
      if(!error.response) {
        ToastAndroid.show("Tidak bisa terhubung ke server", ToastAndroid.SHORT);
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
            <Title>Tambah Pengurus</Title>
          </Body>
          <Right style={{ flex: 2 }}>
            <Button
              onPress={() => this.onPost()}
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
            <CardItem>
              <Icon name="lock" style={styles.icon} />
              <Item>
                <Input
                  autoCapitalize="none"
                  placeholder="Ketik Ulang Password"
                  value={this.state.c_password}
                  secureTextEntry
                  onChangeText={c_password => this.setState({c_password})}
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
    flex: 0,
    marginTop: 0,
    marginBottom: 15,
    marginLeft: 0,
    marginRight: 0
  },
  icon: {
    width: 30,
    color: "#777"
  }
});

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  null
)(EntryUser);
