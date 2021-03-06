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
  CardItem,
  Radio
} from "native-base";
import { StyleSheet, ToastAndroid } from "react-native";
import { CATEGORIES_URL } from "../Config/URLs";
import { connect } from "react-redux";
import { logout } from "../Actions";
import axios from "axios";

class EntryCat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      type: 1
    };
  }

  validateName = () => this.state.name === "";

  onPost = () => {
    const { navigation, auth, logout } = this.props;
    if(this.validateName()) {
      ToastAndroid.show("Nama kategori tidak boleh kosong", ToastAndroid.SHORT);
      return;
    }

    const postData = {
      name: this.state.name,
      type: this.state.type
    };

    const postHeader = {
      headers: {
        Authorization: `Bearer ${auth.access_token}`
      }
    };

    axios.post(CATEGORIES_URL, postData, postHeader)
    .then(response => {
      navigation.goBack();
      ToastAndroid.show("Anda berhasil menambahkan kategori", ToastAndroid.SHORT);
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
            <Title>Tambah Kategori</Title>
          </Body>
          <Right style={{ flex: 2 }}>
            <Button
              onPress={this.onPost}
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
              <Item>
                <Input
                  autoCapitalize="none"
                  placeholder="Nama Kategori"
                  value={this.state.name}
                  onChangeText={name => this.setState({name})}
                />
              </Item>
            </CardItem>
            <CardItem>
              <Left style={{ flex: 0 }}>
                <Radio
                  onPress={() => this.setState({ type: 1 })}
                  selected={this.state.type === 1}
                />
                <Text>Pemasukan</Text>
              </Left>
              <Left style={{ marginLeft: 15 }}>
                <Radio
                  onPress={() => this.setState({ type: 2 })}
                  selected={this.state.type === 2}
                />
                <Text>Pengeluaran</Text>
              </Left>
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
  }
});

const mapStateToProps = state => ({
  categories: state.categories,
  auth: state.auth
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EntryCat);
