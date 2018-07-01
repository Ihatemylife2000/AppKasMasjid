import React, { Component } from "react";
import {
  Container,
  Content,
  Button,
  Icon,
  Item,
  Input,
  Text,
  Header,
  Title,
  Left,
  Right,
  Body,
  Card,
  CardItem
} from "native-base";
import {
  StyleSheet,
  TouchableNativeFeedback,
  DatePickerAndroid,
  ToastAndroid
} from "react-native";
import { connect } from "react-redux";
import "intl";
import "intl/locale-data/jsonp/id";

const l10nIDR = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR"
});

const year = new Intl.DateTimeFormat("id-ID", { year: "numeric" });
const month = new Intl.DateTimeFormat("id-ID", { month: "short" });
const month_year = new Intl.DateTimeFormat("id-ID", {
  month: "long",
  year: "numeric"
});

class Report extends Component {
  state = {
    from: new Date(),
    to: new Date()
  };

  showDateTimePicker = state => async () => {
    const { action, year, month, day } = await DatePickerAndroid.open({
      date: this.state[state]
    });
    if (action !== DatePickerAndroid.dismissedAction) {
      this.setState({
        [state]: new Date(year, month, day)
      });
    }
  };

  componentDidMount() {
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), 0, 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    this.setState({
      from: firstDay,
      to: lastDay
    });
  }

  getBalance(datas) {
    const { categories } = this.props;
    const balance = datas.reduce((a, b) => {
      const cat = categories.find(cat => cat.id === b.categories_id);
      const amount = cat.type === 1 ? b.amount : -b.amount;
      return amount + a;
    }, 0);

    return balance;
  }

  getIncome(datas) {
    const { categories } = this.props;
    const income = datas.reduce((a, b) => {
      const cat = categories.find(cat => cat.id === b.categories_id);
      const amount = cat.type === 1 ? b.amount : 0;
      return amount + a;
    }, 0);

    return income;
  }

  getExpense(datas) {
    const { categories } = this.props;
    const expense = datas.reduce((a, b) => {
      const cat = categories.find(cat => cat.id === b.categories_id);
      const amount = cat.type === 2 ? b.amount : 0;
      return amount + a;
    }, 0);

    return expense;
  }

  render() {
    const { navigation, transactions } = this.props;
    const dateList = [];
    const from = new Date(this.state.from);
    const to = new Date(this.state.to);
    do {
      dateList.push(new Date(from));
      from.setMonth(from.getMonth() + 1);
    } while(from.getMonth() <= to.getMonth() ||
      from.getFullYear() !== to.getFullYear());
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
            <Title>Laporan</Title>
          </Body>
          <Right style={{ flex: 1 }} />
        </Header>
        <Content>
          <Card style={styles.card}>
            <CardItem>
              <TouchableNativeFeedback
                onPress={this.showDateTimePicker("from")}
              >
                <Left style={{ flex: 3 }}>
                  <Item disabled>
                    <Input
                      disabled
                      value={month_year.format(this.state.from)}
                    />
                    <Icon name="arrow-dropdown" style={{ color: "#777" }} />
                  </Item>
                </Left>
              </TouchableNativeFeedback>
            </CardItem>
            <CardItem>
              <TouchableNativeFeedback
                onPress={this.showDateTimePicker("to")}
              >
                <Left style={{ flex: 3 }}>
                  <Item disabled>
                    <Input
                      disabled
                      value={month_year.format(this.state.to)}
                    />
                    <Icon name="arrow-dropdown" style={{ color: "#777" }}/>
                  </Item>
                </Left>
              </TouchableNativeFeedback>
            </CardItem>
          </Card>
          <Card style={styles.card}>
            {
              dateList.map((date, index) => {
                const filtered = transactions.filter(data => {
                  const data_df = new Date(data.date);
                  return date.getMonth() === data_df.getMonth() &&
                    date.getFullYear() === data_df.getFullYear()
                });
                const balance = this.getBalance(filtered) || 0;
                const income = this.getIncome(filtered) || 0;
                const expense = this.getExpense(filtered) || 0;
                return (
                  <TouchableNativeFeedback
                    key={index}
                    onPress={() => navigation.navigate("DetailReport", {date})}
                  >
                    <CardItem>
                      <Left style={{ flex: 1 }}>
                        <Body>
                          <Text>{month.format(date)}</Text>
                          <Text note>{year.format(date)}</Text>
                        </Body>
                      </Left>
                      <Right style={{ flex: 2 }}>
                        <Text style={{ color: "#1F88A7" }}>
                          {l10nIDR.format(income)}
                        </Text>
                        <Text style={{ color: "#B9264F" }}>
                          {l10nIDR.format(expense)}
                        </Text>
                      </Right>
                      <Right style={{ flex: 2 }}>
                        <Text style={{ fontSize: 15 }}>
                          {l10nIDR.format(balance)}
                        </Text>
                      </Right>
                    </CardItem>
                  </TouchableNativeFeedback>
                )
              })
            }
          </Card>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    flex: 0,
    marginTop: 0,
    marginBottom: 15,
    marginLeft: 0,
    marginRight: 0
  }
});

const mapStateToProps = state => ({
  categories: state.categories,
  transactions: state.transactions
});

export default connect(
  mapStateToProps,
  null
)(Report);
