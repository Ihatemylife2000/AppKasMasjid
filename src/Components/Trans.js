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
  Tabs,
  Tab,
  ScrollableTab,
  Fab
} from "native-base";
import {
  AsyncStorage,
  ToastAndroid,
  TouchableNativeFeedback
} from "react-native";
import { TRANSACTIONS_URL, CATEGORIES_URL, USER_URL } from "../Config/URLs";
import { setTransaction, setCategory, setUser, logout } from "../Actions";
import { connect } from "react-redux";
import dateFormat from "dateformat";
import axios from "axios";
import ITab from "./ITab";
import "intl";
import "intl/locale-data/jsonp/id";

const l10nIDR = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR"
});

class Trans extends Component {
  componentDidMount() {
    const {
      auth,
      setTransaction,
      setCategory,
      setUser,
      logout
    } = this.props;

    AsyncStorage.getItem("categories").then(item => {
      if(item) {
        item = JSON.parse(item);
        setCategory(item);
        AsyncStorage.getItem("transactions").then(item => {
          if(item) {
            item = JSON.parse(item);
            setTransaction(item);
          }
        }).done();
      }
    }).done();

    if(auth.role.id === 1)
      AsyncStorage.getItem("user").then(item => {
        if(item) {
          item = JSON.parse(item);
          setUser(item);
        }
      }).done();

    const getHeader = {
      headers: {
        Authorization : `Bearer ${auth.access_token}`
      }
    };

    axios.get(CATEGORIES_URL, getHeader)
    .then(response => {
      setCategory(response.data);
    })
    .catch(error => {
      if(!error.response) {
        ToastAndroid.show("Tidak bisa terhubung ke server", ToastAndroid.SHORT);
      } else if(error.response.status === 401) {
        ToastAndroid.show("Autentikasi gagal", ToastAndroid.SHORT);
        logout();
      }
    });

    axios.get(TRANSACTIONS_URL, getHeader)
    .then(response => {
      setTransaction(response.data);
    })
    .catch(error => {
      if(!error.response) {
        ToastAndroid.show("Tidak bisa terhubung ke server", ToastAndroid.SHORT);
      } else if(error.response.status === 401) {
        ToastAndroid.show("Autentikasi gagal", ToastAndroid.SHORT);
        logout();
      }
    })

    axios.get(USER_URL, getHeader)
    .then(response => {
      setUser(response.data);
    })
    .catch(error => {
      if(!error.response) {
        ToastAndroid.show("Tidak bisa terhubung ke server", ToastAndroid.SHORT);
      } else if(error.response.status === 401) {
        ToastAndroid.show("Autentikasi gagal", ToastAndroid.SHORT);
        logout();
      }
    });
  }

  getBalance() {
    const { transactions, categories } = this.props;
    if(transactions.length === 0)
      return 0;

    const filtered = transactions.filter(data => {
      const now = new Date();
      const date = new Date(data.date);
      now.setHours(0, 0, 0, 0);
      date.setHours(0, 0, 0, 0);
      return date <= now;
    });

    const balance = filtered.reduce((a, b) => {
      const cat = categories.find(cat => cat.id === b.categories_id);
      const value = cat.type === 1 ? b.value : -b.value;
      return value + a;
    }, 0);

    return balance;
  }

  render() {
    const { navigation } = this.props;
    const dateList = [];
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    now.setDate(1);
    for(let i = 0; i < 9; i++) {
      now.setMonth(now.getMonth() - 1);
      dateList.push(new Date(now));
    }
    return (
      <Container>
        <Header>
          <Left style={{ flex: 1 }}>
            <Button
              onPress={() => navigation.openDrawer()}
              transparent
              rounded
            >
              <Icon name="menu" />
            </Button>
          </Left>
          <Body style={{ flex: 3 }}>
            <Title>
              {l10nIDR.format(this.getBalance())}
            </Title>
          </Body>
          <Right style={{ flex: 1 }} />
        </Header>
        <Tabs
          renderTabBar={() => <ScrollableTab />}
          prerenderingSiblingsNumber={Infinity}
          /*page={1}*/
        >
          <Tab heading="MASA DEPAN">
            <ITab
              target={new Date()}
              type="future"
              navigation={navigation}
              inTab
            />
          </Tab>
          <Tab heading="BULAN INI">
            <ITab
              target={new Date()}
              type="thisMonth"
              navigation={navigation}
              inTab
            />
          </Tab>
          {
            dateList.map((date, index) => {
              const last_month = new Date();
              last_month.setMonth(last_month.getMonth() - 1);
              return (
                <Tab
                  key={index}
                  heading={
                    date.getMonth() === last_month.getMonth() &&
                      date.getFullYear() === last_month.getFullYear()
                      ? "BULAN LALU"
                      : dateFormat(date, "mm/yyyy")
                  }
                >
                  <ITab
                    target={date}
                    type="ignoreDay"
                    navigation={navigation}
                    inTab
                  />
                </Tab>
              );
            })
          }
        </Tabs>
        <Fab
          direction="up"
          containerStyle={{ left: "50%", right: null, marginRight: "-50%" }}
          useForeground
          background={TouchableNativeFeedback.Ripple("rgba(256, 256, 256, 0.3)", true)}
          style={{ backgroundColor: "#00898e" }}
          position="bottomRight"
          onPress={() => navigation.navigate("EntryTrans")}
        >
          <Icon name="add" />
        </Fab>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  transactions: state.transactions,
  categories: state.categories
});

const mapDispatchToProps = dispatch => ({
  setTransaction: data => dispatch(setTransaction(data)),
  setCategory: data => dispatch(setCategory(data)),
  setUser: data => dispatch(setUser(data)),
  logout: () => dispatch(logout())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Trans);
