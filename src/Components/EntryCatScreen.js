import React, { Component } from "react";
import axios from "axios";
import { CATEGORIES_URL } from "../Config/URLs";
import { connect } from "react-redux";
import { StyleSheet, ToastAndroid, View } from "react-native";
import { RadioButtonGroup, RadioButton, Paragraph, TextInput, Card, Toolbar, ToolbarBackAction, ToolbarContent, ToolbarAction, Colors, ListItem, Divider } from "react-native-paper";

class EntryCatScreen extends Component {
  state = {
    name: "",
    type: 1
  };

  componentDidMount() {
    const { navigation } = this.props;
    navigation.setParams({ post: this.onPost});
  }

  onPost = () => {
    const { navigation, auth } = this.props;
    if(this.state.name === "" || this.state.type === 0)
      return;

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
      ToastAndroid.show("Anda berhasil menambakan", ToastAndroid.SHORT);
      navigation.goBack();
    })
    .catch(error => {
      if(!error.response) {
        ToastAndroid.show("Tidak bisa terhubung ke server", ToastAndroid.SHORT);
      }
    });
  }

  _back = () => this.props.navigation.goBack();

  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <Toolbar>
          <ToolbarBackAction onPress={this._back} />
          <ToolbarContent
            title="Tambah Kategori"
          />
          <ToolbarAction icon="save" onPress={this.onPost} />
        </Toolbar>
        <Card style={styles.card}>
          <View style={styles.row}>
            <View style={styles.input}>
              <TextInput
                autoCapitalize="none"
                placeholder="Nama Kategori"
                value={this.state.name}
                onChangeText={name => this.setState({name})}
              />
            </View>
          </View>
          <RadioButtonGroup
            value={this.state.type}
            onValueChange={type => this.setState({ type })}
          >
            <View style={styles.row}>
              <View style={styles.radio}>
                <RadioButton value={1} />
                <Paragraph>Pemasukan</Paragraph>
              </View>
              <View style={[styles.radio, { marginLeft: 8 }]}>
                <RadioButton value={2} />
                <Paragraph>Pengeluaran</Paragraph>
              </View>
            </View>
          </RadioButtonGroup>
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
  },
  radio: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  row: {
    flexDirection: "row",
    padding: 8,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    justifyContent: "center",
  }
});

const mapStateToProps = state => ({
  categories: state.categories,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  null
)(EntryCatScreen);
