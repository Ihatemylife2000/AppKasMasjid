import React, { Component } from "react";
import {
  Container,
  Content,
  Button,
  Icon,
  Text,
  Header,
  Title,
  Left,
  Right,
  Body,
  Card,
  CardItem
} from "native-base";
import { StyleSheet, Alert, ToastAndroid } from "react-native";
import { TRANSACTIONS_URL } from "../Config/URLs";
import { logout } from "../Actions";
import { connect } from "react-redux";
import axios from "axios";
import "intl";
import "intl/locale-data/jsonp/id";

const l10nIDR = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR"
});

const datef = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric"
});

class DetailTrans extends Component {
  componentDidUpdate(prevProps) {
    const { transactions, navigation } = this.props;
    if (transactions !== prevProps.transactions) {
      const id = navigation.getParam("id");
      const data = transactions.find(data => data.id === id);
      if(!data)
        navigation.goBack();
    }
  }

  onRemove = () => {
    const { navigation, auth, logout } = this.props;
    const deleteHeader = {
      headers: {
        Authorization : `Bearer ${auth.access_token}`
      }
    };

    const id = navigation.getParam("id");

    axios.delete(`${TRANSACTIONS_URL}/${id}`, deleteHeader)
    .then(response => {
      ToastAndroid.show("Anda berhasil menghapus transaksi", ToastAndroid.SHORT);
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
    const { navigation, transactions, categories, user } = this.props;
    const id = navigation.getParam("id");
    const data = transactions.find(data => data.id === id);
    if(!data)
      return null;
    const cat = categories.find(cat => cat.id === data.categories_id);
    const usr = user.find(usr => usr.id === data.users_id);
    return (
      <Container>
        <Header>
          <Left style={{ flex: 1 }}>
            <Button
              onPress={() => navigation.goBack()}
              transparent
              rounded
            >
              <Icon name="close" />
            </Button>
          </Left>
          <Body style={{ flex: 3 }} />
          <Right style={{ flex: 1 }}>
            <Button
              onPress={() => navigation.navigate("EditTrans", {id})}
              transparent
              rounded
            >
              <Icon name="create" />
            </Button>
            <Button
              onPress={() => Alert.alert(
                "Hapus Transaksi",
                "Apakah kamu benar ingin menghapus ?",
                [
                  {
                    text: "Ya",
                    onPress: this.onRemove
                  },
                  {
                    text: "Tidak"
                  }
                ]
              )}
              transparent
              rounded
            >
              <Icon name="trash" />
            </Button>
          </Right>
        </Header>
        <Content>
          <Card style={styles.card}>
            <CardItem>
              <Text
                style={{
                  fontSize: 35,
                  color: cat.type === 1 ? "#1F88A7" : "#B9264F"
                }}
              >
                {l10nIDR.format(data.value)}
              </Text>
            </CardItem>
            {data.description &&
              <CardItem>
                <Left>
                  <Icon name="list" style={styles.icon} />
                  <Text>{data.description}</Text>
                </Left>
              </CardItem>}
            <CardItem>
              <Left>
                <Icon name="apps" style={styles.icon} />
                <Text>{cat.name}</Text>
              </Left>
            </CardItem>
            <CardItem>
              <Left>
                <Icon name="calendar" style={styles.icon} />
                <Text>
                  {datef.format(new Date(data.date))}
                </Text>
              </Left>
            </CardItem>
            {usr &&
              <CardItem>
                <Left>
                  <Icon name="person" style={styles.icon} />
                  <Text>{usr.name}</Text>
                </Left>
              </CardItem>}
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
  transactions: state.transactions,
  categories: state.categories,
  user: state.user,
  auth: state.auth
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DetailTrans);
