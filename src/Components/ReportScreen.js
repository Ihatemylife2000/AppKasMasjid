import React, { Component } from "react";
import {
  StyleSheet,
  TouchableNativeFeedback,
  DatePickerAndroid,
  View,
  ScrollView,
  FlatList
} from "react-native";
import { Subheading, Text, TouchableRipple, FAB, Toolbar, Card, TextInput, ToolbarBackAction, ToolbarContent, ToolbarAction, Colors, ListItem, Divider } from "react-native-paper";
import dateFormat from "dateformat";
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

class ReportScreen extends Component {
  state = {
    from: dateFormat(new Date(), "yyyy-mm-dd"),
    to: dateFormat(new Date(), "yyyy-mm-dd")
  };

  showDateTimePicker = state => async () => {
    const { action, year, month, day } = await DatePickerAndroid.open({
      date: new Date(this.state[state])
    });
    if (action !== DatePickerAndroid.dismissedAction) {
      this.setState({
        [state]: dateFormat(new Date(year, month, day), "yyyy-mm-dd")
      });
    }
  }

  componentWillMount() {
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), 0, 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    this.setState({
      from: dateFormat(firstDay, "yyyy-mm-dd"),
      to: dateFormat(lastDay, "yyyy-mm-dd")
    });
  }

  getBalance = datas => {
    const { categories } = this.props;
    const balance = datas.reduce((a, b) => {
      const cat = categories.find(cat => cat.id === b.categories_id);
      const amount = cat.type === 1 ? b.amount : -b.amount;
      return amount + a;
    }, 0);

    return balance;
  }

  getIncome = datas => {
    const { categories } = this.props;
    const income = datas.reduce((a, b) => {
      const cat = categories.find(cat => cat.id === b.categories_id);
      const amount = cat.type === 1 ? b.amount : 0;
      return amount + a;
    }, 0);

    return income;
  }

  getExpense = datas => {
    const { categories } = this.props;
    const expense = datas.reduce((a, b) => {
      const cat = categories.find(cat => cat.id === b.categories_id);
      const amount = cat.type === 2 ? b.amount : 0;
      return amount + a;
    }, 0);

    return expense;
  }

  _drawerOpen = () => this.props.navigation.navigate("DrawerOpen");

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
      <View style={styles.container}>
        <Toolbar>
          <ToolbarAction icon="menu" onPress={this._drawerOpen} />
          <ToolbarContent
            title="Laporan"
          />
        </Toolbar>
        <Card style={styles.card}>
          <TouchableRipple onPress={this.showDateTimePicker("from")}>
            <View style={styles.row}>
              <View style={[styles.content]}>
                <TextInput
                  disabled
                  value={month_year.format(new Date(this.state.from))}
                />
              </View>
            </View>
          </TouchableRipple>
          <TouchableRipple onPress={this.showDateTimePicker("to")}>
            <View style={styles.row}>
              <View style={[styles.content]}>
                <TextInput
                  disabled
                  value={month_year.format(new Date(this.state.to))}
                />
              </View>
            </View>
          </TouchableRipple>
        </Card>
        <Card style={[styles.card, { marginTop: 16 }]}>
          {
            dateList.map(date => {
              const filtered = transactions.filter(data => {
                const data_df = new Date(data.date);
                return date.getMonth() === data_df.getMonth() &&
                  date.getFullYear() === data_df.getFullYear()
              });
              const balance = this.getBalance(filtered) || 0;
              const income = this.getIncome(filtered) || 0;
              const expense = this.getExpense(filtered) || 0;
              return (
                <TouchableRipple
                  key={date}
                  onPress={() => navigation.navigate("ReportDetail", {date})}
                >
                  <View style={styles.row}>
                    <View style={[styles.left, { flex: 1 }]}>
                      <View style={styles.body}>
                        <Text>{month.format(new Date(date))}</Text>
                        <Text>{year.format(new Date(date))}</Text>
                      </View>
                    </View>
                    <View style={[styles.right, { flex: 2 }]}>
                      <Text style={{ color: "#1F88A7" }}>
                        {l10nIDR.format(income)}
                      </Text>
                      <Text style={{ color: "#B9264F" }}>
                        {l10nIDR.format(expense)}
                      </Text>
                    </View>
                    <View style={[styles.right, { flex: 2 }]}>
                      <Text style={{ fontSize: 15 }}>
                        {l10nIDR.format(balance)}
                      </Text>
                    </View>
                  </View>
                </TouchableRipple>
              )
            })
          }
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
  },
  left: {
    flex: 1,
		alignSelf: "center",
		alignItems: "flex-start"
  },
  body: {
		flex: 1,
		alignItems: "center",
		alignSelf: "center"
	},
  right: {
    flex: 1,
    alignSelf: "center",
    alignItems: "flex-end"
  }
});

const mapStateToProps = state => ({
  categories: state.categories,
  transactions: state.transactions
});

export default connect(
  mapStateToProps,
  null
)(ReportScreen);
