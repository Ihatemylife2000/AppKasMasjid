import React, { Component } from "react";
import {
  Container,
  Content,
  Icon,
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
  AsyncStorage
} from "react-native";
import { connect } from "react-redux";
import "intl";
import "intl/locale-data/jsonp/id";

const l10nIDR = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR"
});

const day = new Intl.DateTimeFormat('id-ID', { day: "2-digit" });
const weekday = new Intl.DateTimeFormat('id-ID', { weekday: "long" });
const month = new Intl.DateTimeFormat('id-ID', {
  month: "long",
  year: "numeric"
});

class ITab extends Component {
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

  groupBy = (array, f) => {
    let groups = {};
    array.forEach(o => {
      let group = f(o);
      groups[group] = groups[group] || [];
      groups[group].push(o);
    })

    return Object.keys(groups).length > 0 && groups;
  }

  filter = () => {
    const { transactions, target, action } = this.props;
    if(transactions.length === 0)
      return null;

    const filtered = transactions.filter(data => {
      const date = new Date(data.date);
      return action(date, target);
    });

    const grouped = this.groupBy(filtered, item => item.date);

    const sorted = grouped ?
      Object.keys(grouped)
      .sort((a, b) => {
        return new Date(b) - new Date(a)
      })
      .reduce((obj, key) => {
        return {
          ...obj,
          [key]: grouped[key]
        }
      }, null) : null;

    return sorted;
  }

  empty = () => {
    const { inTab } = this.props;
    return (
      <Container style={styles.container}>
        <Content>
          <Body>
            <Text
              style={{ fontSize: 30, color: "#777", alignSelf: "center" }}
            >
              Tidak ada transaksi
            </Text>
            {inTab &&
              <Text style={{ color: "#777", alignSelf: "center" }} >
                Tekan {
                  <Icon
                    style={{
                      fontSize: 15,
                      color: "#777",
                      alignSelf: "center"
                    }}
                    name="add"
                  />} untuk menambah transaksi
              </Text>}
          </Body>
        </Content>
      </Container>
    )
  }

  overview = () => {
    const { target, action, transactions } = this.props;
    const filtered = transactions.filter(data => {
      const date = new Date(data.date);
      return action(date, target);
    });
    const balance = this.getBalance(filtered) || 0;
    const income = this.getIncome(filtered) || 0;
    const expense = this.getExpense(filtered) || 0;
    return (
      <Card style={styles.card}>
        <CardItem style={{ paddingBottom: 0 }}>
          <Text style={{ fontSize: 21, fontWeight: "bold" }}>
            Ringkasan
          </Text>
        </CardItem>
        {income > 0 &&
          <CardItem style={expense > 0 ? { paddingBottom: 0 } : {}}>
            <Text>Pemasukan</Text>
            <Right style={{ flex: 2 }}>
              <Text style={{ color: "#1F88A7" }}>
                {l10nIDR.format(income)}
              </Text>
            </Right>
          </CardItem>}
        {expense > 0 &&
          <CardItem style={income > 0 ? { paddingBottom: 0 } : {}}>
            <Text>Pengeluaran</Text>
            <Right style={{ flex: 2 }}>
              <Text style={{ color: "#B9264F" }}>
                {l10nIDR.format(expense)}
              </Text>
            </Right>
          </CardItem>}
        {income > 0 && expense > 0 &&
          <CardItem>
            <Right style={{ flex: 2 }}>
              <Text style={{ fontSize: 20 }}>
                {l10nIDR.format(balance)}
              </Text>
            </Right>
          </CardItem>}
      </Card>
    );
  }

  render() {
    const { navigation, transactions, categories } = this.props;
    const filtered = this.filter();
    if(!filtered)
      return this.empty();
    return (
      <Content>
        {this.overview()}
        {
          Object.keys(filtered).map(date => {
            const data = filtered[date];
            return (
              <Card key={date} style={styles.card}>
                <CardItem
                  bordered
                  style={{ paddingTop: -8, paddingBottom: -8 }}>
                  <Left style={{ flex: 4 }}>
                    <Text style={{ fontSize: 35 }}>
                      {day.format(new Date(date))}
                    </Text>
                    <Body>
                      <Text>
                        {weekday.format(new Date(date))}
                      </Text>
                      <Text note>
                        {month.format(new Date(date))}
                      </Text>
                    </Body>
                  </Left>
                  <Right style={{ flex: 3 }}>
                    <Text>
                      {l10nIDR.format(this.getBalance(data))}
                    </Text>
                  </Right>
                </CardItem>
                {
                  data.map(dat => {
                    const cat = categories.find(cat => {
                      return cat.id === dat.categories_id
                    });
                    return (
                      <TouchableNativeFeedback
                        key={dat.id}
                        onPress={() => navigation.navigate("Detail", {
                          id: dat.id
                        })}
                      >
                        <CardItem>
                          <Left style={{ flex: 3 }}>
                            <Body>
                              <Text>{cat.name}</Text>
                              <Text note>{dat.description}</Text>
                            </Body>
                          </Left>
                          <Right style={{ flex: 3 }}>
                            <Text
                              style={{
                                color: cat.type === 1
                                  ? "#1F88A7"
                                  : "#B9264F"
                              }}>
                              {l10nIDR.format(dat.amount)}
                            </Text>
                          </Right>
                        </CardItem>
                      </TouchableNativeFeedback>
                    );
                  })
                }
              </Card>
            );
          })
        }
      </Content>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 30,
    paddingRight: 30
  },
  card: {
    flex: 0,
    marginTop: 0,
    marginBottom: 15,
    marginLeft: 1,
    marginRight: 1
  }
});

const mapStateToProps = state => ({
  transactions: state.transactions,
  categories: state.categories
});

export default connect(
  mapStateToProps,
  null
)(ITab);
