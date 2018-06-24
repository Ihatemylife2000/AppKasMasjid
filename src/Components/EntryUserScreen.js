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
import { USER_URL } from "../Config/URLs";
import { connect } from "react-redux";
import { Card, TextInput, Toolbar, ToolbarBackAction, ToolbarContent, ToolbarAction, Colors } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";

class EntryUserScreen extends Component {
  state = {
    name: "",
    email: "",
    password: "",
    c_password: ""
  };

  onPost = () => {
    const { navigation, auth } = this.props;
    if(this.state.name === "" ||
      this.state.email === "" ||
      this.state.password === "" ||
      this.state.c_password === "")
      return;

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
      ToastAndroid.show("Anda berhasil menambakan", ToastAndroid.SHORT);
      navigation.goBack();
    })
    .catch(error => {
      if(!error.response) {
        ToastAndroid.show("Tidak bisa terhubung ke server", ToastAndroid.SHORT);
      }
    });
  };

  _back = () => this.props.navigation.goBack();

  render() {
    return (
      <View style={styles.container}>
        <Toolbar>
          <ToolbarBackAction onPress={this._back} />
          <ToolbarContent
            title="Tambah Pengurus"
          />
          <ToolbarAction icon="save" onPress={this.onPost} />
        </Toolbar>
        <Card style={styles.card}>
          <View style={styles.row}>
            <View style={[styles.item, styles.icon, styles.content, { flex: 0 }]}>
              <Icon name="person" size={24} />
            </View>
            <View style={[styles.content]}>
              <TextInput
                autoCapitalize="none"
                placeholder="Nama"
                value={this.state.name}
                onChangeText={name => this.setState({name})}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={[styles.item, styles.icon, styles.content, { flex: 0 }]}>
              <Icon name="mail" size={24} />
            </View>
            <View style={[styles.content]}>
              <TextInput
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="Email"
                value={this.state.email}
                onChangeText={email => this.setState({email})}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={[styles.item, styles.icon, styles.content, { flex: 0 }]}>
              <Icon name="lock" size={24} />
            </View>
            <View style={[styles.content]}>
              <TextInput
                autoCapitalize="none"
                placeholder="Password"
                value={this.state.password}
                secureTextEntry
                onChangeText={password => this.setState({password})}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={[styles.item, styles.icon, styles.content, { flex: 0 }]}>
              <Icon name="lock" size={24} />
            </View>
            <View style={[styles.content]}>
              <TextInput
                autoCapitalize="none"
                placeholder="Ketik Ulang Password"
                value={this.state.c_password}
                secureTextEntry
                onChangeText={c_password => this.setState({c_password})}
              />
            </View>
          </View>
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
  auth: state.auth
});

export default connect(
  mapStateToProps,
  null
)(EntryUserScreen);
