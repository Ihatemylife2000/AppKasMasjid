import React, { Component } from "react";
import { StyleSheet, Alert, ToastAndroid, View } from "react-native";
import axios from "axios";
import { USER_URL } from "../Config/URLs";
import { connect } from "react-redux";
import { Paragraph, Card, CardContent, FAB, Toolbar, ToolbarBackAction, ToolbarContent, ToolbarAction, Colors, ListItem, Divider } from "react-native-paper";

class DetailUserScreen extends Component {
  componentDidUpdate(prevProps) {
    const { user, navigation } = this.props;
    if (user !== prevProps.user) {
      const id = navigation.getParam("id");
      const data = user.find(data => data.id === id);
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

    axios.delete(`${USER_URL}/${id}`, deleteHeader)
    .then(response => {
      ToastAndroid.show("Anda berhasil menghapus", ToastAndroid.SHORT);
    })
    .catch(error => {
      if(!error.response) {
        ToastAndroid.show("Tidak bisa terhubung ke server", ToastAndroid.SHORT);
      }
    });
  }

  _back = () => this.props.navigation.goBack();

  render() {
    const { navigation, user } = this.props;
    const id = navigation.getParam("id");
    const data = user.find(data => data.id === id);
    if(!data)
      return null;
    return (
      <View style={styles.container}>
        <Toolbar>
          <ToolbarAction icon="close" onPress={this._back} />
          <ToolbarContent />
          <ToolbarAction
            icon="delete"
            onPress={() => Alert.alert(
              "Hapus Pengurus",
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
          <ListItem title={data.name} icon="person" />
          <ListItem title={data.email} icon="mail" />
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
  user: state.user,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  null
)(DetailUserScreen);
