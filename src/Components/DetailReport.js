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
  TouchableNativeFeedback,
  DatePickerAndroid
} from "react-native";
import dateFormat from "dateformat";
import ITab from "./ITab";
import { connect } from "react-redux";

class DetailReport extends Component {
  render() {
    const { navigation } = this.props;
    const date = navigation.getParam("date");
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
            <Title>Transaksi</Title>
          </Body>
          <Right style={{ flex: 1 }} />
        </Header>
        <ITab
          target={date}
          type="ignoreDay"
          navigation={navigation}
          inTab={false}
        />
      </Container>
    );
  }
}

export default connect()(DetailReport);
