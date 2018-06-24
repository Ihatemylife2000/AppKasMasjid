import React, { Component } from "react";
import {
  Container,
  Button,
  Icon,
  Header,
  Title,
  Left,
  Right,
  Body
} from "native-base";
import {
  StyleSheet,
  TouchableNativeFeedback,
  DatePickerAndroid,
  View
} from "react-native";
import { Text, TouchableRipple, FAB, Toolbar, Card, TextInput, ToolbarBackAction, ToolbarContent, ToolbarAction, Colors, ListItem, Divider } from "react-native-paper";
import dateFormat from "dateformat";
import ITab from "./ITab";
import { connect } from "react-redux";

class ReportDetailScreen extends Component {
  _back = () => this.props.navigation.goBack();
  
  render() {
    const { navigation, transactions } = this.props;
    const date = navigation.getParam("date");
    return (
      <View style={styles.container}>
        <Toolbar>
          <ToolbarBackAction onPress={this._back} />
          <ToolbarContent
            title="Transaksi"
          />
        </Toolbar>
        <ITab
          target={date}
          action={(date, target) => {
            return date.getMonth() === target.getMonth() &&
              date.getFullYear() === target.getFullYear();
          }}
          navigation={navigation}
          inTab={false}
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
  categories: state.categories,
  transactions: state.transactions
});

export default connect(
  mapStateToProps,
  null
)(ReportDetailScreen);
