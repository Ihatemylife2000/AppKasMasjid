import React, { Component } from "react";
import {
  Tabs,
  Tab,
  ScrollableTab
} from "native-base";
import { StyleSheet, AsyncStorage, ToastAndroid, View } from "react-native";
import dateFormat from "dateformat";
import axios from "axios";
import { TRANSACTIONS_URL, CATEGORIES_URL, USER_URL } from "../Config/URLs";
import { setTransaction, setCategory, setUser } from "../Actions";
import ITab from "./ITab";
import { connect } from "react-redux";
import "intl";
import "intl/locale-data/jsonp/id";
import { Card, FAB, TextInput, Toolbar, ToolbarBackAction, ToolbarContent, ToolbarAction, Colors } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";

const l10nIDR = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR"
});

class TransScreen extends Component {
  componentDidUpdate(prevProps) {
    const { transactions, categories, navigation } = this.props;
    if (transactions !== prevProps.transactions ||
      categories !== prevProps.categories)
      navigation.setParams({ balance: this.getBalance });
  }

  componentDidMount() {
    const {
      auth,
      setTransaction,
      setCategory,
      setUser
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
      }
    });

    axios.get(TRANSACTIONS_URL, getHeader)
    .then(response => {
      setTransaction(response.data);
    })
    .catch(error => {
      if(!error.response) {
        ToastAndroid.show("Tidak bisa terhubung ke server", ToastAndroid.SHORT);
      }
    })

    if(auth.role.id === 1)
      axios.get(USER_URL, getHeader)
      .then(response => {
        setUser(response.data);
      })
      .catch(error => {
        if(!error.response) {
          ToastAndroid.show("Tidak bisa terhubung ke server", ToastAndroid.SHORT);
        }
      });
  }

  getBalance = () => {
    const { transactions, categories } = this.props;
    if(transactions.length === 0)
      return 0;

    const filtered = transactions.filter(data => {
      return new Date(data.date) <= new Date();
    });

    const balance = filtered.reduce((a, b) => {
      const cat = categories.find(cat => cat.id === b.categories_id);
      const amount = cat.type === 1 ? b.amount : -b.amount;
      return amount + a;
    }, 0);

    return balance;
  }

  _addNavigation = () => this.props.navigation.navigate("Entry");

  _drawerOpen = () => this.props.navigation.navigate("DrawerOpen");

  render() {
    /*const dateList = [];
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    for(let i = 0; i < 7; i++) {
      now.setMonth(now.getMonth() - 1);
      dateList.push(new Date(now));
    }*/
    return (
      <View style={styles.container}>
        <Toolbar>
          <ToolbarAction icon="menu" onPress={this._drawerOpen} />
          <ToolbarContent
            title={l10nIDR.format(this.getBalance())}
          />
        </Toolbar>
        {/*<Tabs
          renderTabBar={() =>
            <ScrollableTab
              tabsContainerStyle={{ backgroundColor: "#3FB3A3" }}
            />
          }
          page={1}
        >
          <Tab heading="MASA DEPAN">
            <ITab
              target={new Date()}
              action={(date, target) => {
                date.setHours(0, 0, 0, 0);
                target.setHours(0, 0, 0, 0);
                return date > target;
              }}
              navigation={this.props.navigation}
              inTab
            />
          </Tab>
          <Tab heading="BULAN INI">
            <ITab
              target={new Date()}
              action={(date, target) => {
                date.setHours(0, 0, 0, 0);
                target.setHours(0, 0, 0, 0);
                const first = new Date(target);
                first.setDate(1);
                return date <= target && date >= first;
              }}
              navigation={this.props.navigation}
              inTab
            />
          </Tab>
          {
            dateList.map(date => {
              const last_month = new Date();
              last_month.setMonth(last_month.getMonth() - 1);
              return (
                <Tab
                  key={dateFormat(date, "mm/yyyy")}
                  heading={
                    date.getMonth() === last_month.getMonth() &&
                      date.getFullYear() === last_month.getFullYear()
                      ? "BULAN LALU"
                      : dateFormat(date, "mm/yyyy")
                  }
                >
                  <ITab
                    target={date}
                    action={(date, target) => {
                      return date.getMonth() === target.getMonth() &&
                        date.getFullYear() === target.getFullYear();
                    }}
                    navigation={this.props.navigation}
                    inTab
                  />
                </Tab>
              );
            })
          }
        </Tabs>*/}
        <FAB
          style={{
            position: "absolute",
            bottom: 20,
            justifyContent: "center",
            alignSelf: "center"
          }}
          icon="add"
          onPress={this._addNavigation}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white
  }
});

const mapStateToProps = state => ({
  auth: state.auth,
  transactions: state.transactions,
  categories: state.categories
});

const mapDispatchToProps = dispatch => ({
  setTransaction: data => dispatch(setTransaction(data)),
  setUser: data => dispatch(setUser(data)),
  setCategory: data => dispatch(setCategory(data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TransScreen);
