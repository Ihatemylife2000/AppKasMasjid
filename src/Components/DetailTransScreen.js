import React, { Component } from "react";
import { StyleSheet, Alert, ToastAndroid, View } from "react-native";
import dateFormat from "dateformat";
import axios from "axios";
import { TRANSACTIONS_URL } from "../Config/URLs";
import { connect } from "react-redux";
import { Text, Paragraph, Card, CardContent, FAB, Toolbar, ToolbarBackAction, ToolbarContent, ToolbarAction, Colors, ListItem, Divider } from "react-native-paper";
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

class DetailTransScreen extends Component {
  componentDidUpdate(prevProps) {
    const { transactions, navigation } = this.props;
    if (transactions !== prevProps.transactions) {
      const id = navigation.getParam("id");
      const data = transactions.find(data => data.id === id);
      if (!data)
        navigation.goBack();
    }
  }

  onRemove = () => {
    const { navigation, auth } = this.props;
    const deleteHeader = {
      headers: {
        Authorization : `Bearer ${auth.access_token}`
      }
    };

    const id = navigation.getParam("id");

    axios.delete(`${TRANSACTIONS_URL}/${id}`, deleteHeader)
    .then(response => {
      ToastAndroid.show("Anda berhasil menghapus", ToastAndroid.SHORT);
    })
    .catch(error => {
      if(!error.response) {
        Toast.show("Tidak bisa terhubung ke server", ToastAndroid.SHORT);
      }
    });
  }

  _back = () => this.props.navigation.goBack();

  _editNavigation = id => () => this.props.navigation.navigate("Edit", { id });

  render() {
    const { navigation, transactions, categories } = this.props;
    const id = navigation.getParam("id");
    const data = transactions.find(data => data.id === id);
    if(!data)
      return null;
    const cat = categories.find(cat => cat.id === data.categories_id);
    return (
      <View style={styles.container}>
        <Toolbar>
          <ToolbarAction icon="close" onPress={this._back} />
          <ToolbarContent />
          <ToolbarAction
            icon="create"
            onPress={this._editNavigation(id)}
          />
          <ToolbarAction
            icon="delete"
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
          />
        </Toolbar>
        <Card style={styles.card}>
          <ListItem
            title={
              <Text
                style={{
                  fontSize: 35,
                  color: cat.type === 1 ? "#1f88a7" : "#b9264f"
                }}
              >
                {l10nIDR.format(data.amount)}
              </Text>
            }
          />
          {data.description &&
            <ListItem
              title={data.description}
              icon="short-text"
            />}
          <ListItem
            title={cat.name}
            icon="apps"
          />
          <ListItem
            title={datef.format(new Date(data.date))}
            icon="event"
          />
        </Card>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white
  },
  card: {
    margin: 0
  }
});

const mapStateToProps = state => ({
  transactions: state.transactions,
  categories: state.categories,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  null
)(DetailTransScreen);
