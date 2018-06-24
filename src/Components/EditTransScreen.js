import React, { Component } from "react";
import {
  TouchableNativeFeedback,
  StyleSheet,
  DatePickerAndroid,
  ToastAndroid,
  View
} from "react-native";
import dateFormat from "dateformat";
import axios from "axios";
import { TRANSACTIONS_URL } from "../Config/URLs";
import { connect } from "react-redux";
import { TouchableRipple, Card, TextInput, Toolbar, ToolbarBackAction, ToolbarContent, ToolbarAction, Colors } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import "intl";
import "intl/locale-data/jsonp/id";

const datef = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric"
});

class EditTransScreen extends Component {
  state = {
    date: dateFormat(new Date(), "yyyy-mm-dd"),
    description: "",
    amount: "",
    categories_id: null,
    categories_type: 0,
    categories_name: "Kategori"
  };

  componentDidUpdate(prevProps) {
    const { transactions, navigation } = this.props;
    if (transactions !== prevProps.transactions) {
      const data = transactions.find(data => data.id === this.state.id);
      if (!data)
        navigation.pop(2);
    }
  }

  componentWillMount() {
    const { navigation, transactions, categories } = this.props;
    const id = navigation.getParam("id");
    const data = transactions.find(data => data.id === id);
    const cat = categories.find(cat => cat.id === data.categories_id);
    this.setState({
      ...data,
      categories_type: cat.type,
      categories_name: cat.name
    });
  }

  setCategoryValue = categories => {
    this.setState({
      categories_id: categories.id,
      categories_type: categories.type,
      categories_name: categories.name
    });
  }

  onUpdate = () => {
    const { navigation, auth } = this.props;
    if(this.state.amount === "" ||
      this.state.amount === 0 ||
      this.state.categories_id === null)
      return;

    const putData = {
      date: this.state.date,
      description: this.state.description,
      amount: this.state.amount,
      categories_id: this.state.categories_id
    };

    const putHeader = {
      headers: {
        Authorization : `Bearer ${auth.access_token}`
      }
    };

    axios.put(`${TRANSACTIONS_URL}/${this.state.id}`, putData, putHeader)
    .then(response => {
      ToastAndroid.show("Anda berhasil mengubah", ToastAndroid.SHORT);
      navigation.goBack();
    })
    .catch(error => {
      if(!error.response) {
        ToastAndroid.show("Tidak bisa terhubung ke server", ToastAndroid.SHORT);
      }
    });
  }

  showDateTimePicker = async () => {
    const { action, year, month, day } = await DatePickerAndroid.open({
      date: new Date(this.state.date)
    });
    if (action !== DatePickerAndroid.dismissedAction) {
      this.setState({
        date: dateFormat(new Date(year, month, day), "yyyy-mm-dd")
      });
    }
  }

  _categoriesNavigation = () => this.props.navigation.navigate("Category", {
    set: this.setCategoryValue
  });

  _back = () => this.props.navigation.goBack();

  render() {
    return (
      <View style={styles.container}>
        <Toolbar>
          <ToolbarBackAction onPress={this._back} />
          <ToolbarContent
            title="Ubah Transaksi"
          />
          <ToolbarAction icon="save" onPress={this.onUpdate} />
        </Toolbar>
        <Card style={styles.card}>
          <View style={styles.row}>
            <View style={[styles.item, styles.icon, styles.content, { flex: 0 }]}>
              <Icon name="attach-money" size={24} />
            </View>
            <View style={[styles.content]}>
              <TextInput
                keyboardType="numeric"
                placeholder="Rp0"
                value={this.state.amount.toString()}
                onChangeText={amount => this.setState({
                  amount: parseInt(amount) || ""
                })}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={[styles.item, styles.icon, styles.content, { flex: 0 }]}>
              <Icon name="short-text" size={24} />
            </View>
            <View style={[styles.content]}>
              <TextInput
                autoCapitalize="none"
                placeholder="Catatan"
                value={this.state.description}
                onChangeText={description => this.setState({description})}
              />
            </View>
          </View>
          <TouchableRipple onPress={this._categoriesNavigation}>
            <View style={styles.row}>
              <View style={[styles.item, styles.icon, styles.content, { flex: 0 }]}>
                <Icon name="apps" size={24} />
              </View>
              <View style={[styles.content]}>
                <TextInput
                  disabled
                  value={this.state.categories_name}
                />
              </View>
            </View>
          </TouchableRipple>
          <TouchableRipple onPress={this.showDateTimePicker}>
            <View style={styles.row}>
              <View style={[styles.item, styles.icon, styles.content, { flex: 0 }]}>
                <Icon name="event" size={24} />
              </View>
              <View style={[styles.content]}>
                <TextInput
                  disabled
                  value={datef.format(new Date(this.state.date))}
                />
              </View>
            </View>
          </TouchableRipple>
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
  icon: {
    width: 30,
  },
  item: {
    margin: 8
  },
  card: {
    margin: 0
  },
  row: {
    flexDirection: "row",
    padding: 8,
  },
  content: {
    flex: 1,
    justifyContent: "center",
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
)(EditTransScreen);
