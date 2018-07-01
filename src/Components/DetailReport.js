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
  DatePickerAndroid,
  ToastAndroid
} from "react-native";
import dateFormat from "dateformat";
import RNFetchBlob from "rn-fetch-blob";
import ITab from "./ITab";
import { connect } from "react-redux";
import "intl";
import "intl/locale-data/jsonp/id";

const day = new Intl.DateTimeFormat("id-ID", { day: "2-digit" });
const month_year = new Intl.DateTimeFormat("id-ID", {
  month: "long",
  year: "numeric"
});

class DetailReport extends Component {
  getOpenBalance() {
    const { transactions, categories, navigation } = this.props;
    if(transactions.length === 0)
      return 0;

    const target = navigation.getParam("date");
    const filtered = transactions.filter(data => {
      const date = new Date(data.date);
      target.setHours(0, 0, 0, 0);
      date.setHours(0, 0, 0, 0);
      return date < target;
    });

    const balance = filtered.reduce((a, b) => {
      const cat = categories.find(cat => cat.id === b.categories_id);
      const amount = cat.type === 1 ? b.amount : -b.amount;
      return amount + a;
    }, 0);

    return balance;
  }

  saveCSV() {
    const { categories, transactions, navigation } = this.props;
    const target = navigation.getParam("date");
    const filtered = transactions.filter(data => {
      const date = new Date(data.date);
      return date.getMonth() === target.getMonth() &&
        date.getFullYear() === target.getFullYear();
    });
    if(filtered.length === 0) {
      ToastAndroid.show("Tidak ada transaksi", ToastAndroid.SHORT);
      return;
    }
    const month_yearf = month_year.format(target);
    const path = `${RNFetchBlob.fs.dirs.DownloadDir}/Laporan/${month_yearf}.csv`;
    const header = `${month_yearf}\n\nTanggal,Kategori,Masuk,Keluar,Saldo,Catatan\n`;
    let balance = this.getOpenBalance();
    const first = `1,Saldo Awal,-,-,${balance},\n`;
    let totalIncome = 0;
    let totalExpense = 0;
    const row = filtered.map(item => {
      const cat = categories.find(cat => cat.id === item.categories_id);
      const income = cat.type === 1 ? item.amount : "-";
      const expense = cat.type === 2 ? item.amount : "-";
      const description = item.description || "";
      const date = day.format(new Date(item.date));
      if(cat.type === 1) {
        balance += income;
        totalIncome += income;
      } else {
        balance -= expense;
        totalExpense += expense;
      }
      return `${date},${cat.name},${income},${expense},${balance},${description}\n`;
    }).join("");
    const total = `\n,TOTAL,${totalIncome},${totalExpense},${balance},\n`;
    const file = `${header}${first}${row}${total}`;
    RNFetchBlob.fs.writeFile(path, file, "utf8")
    .then(success => {
      ToastAndroid.show("File laporan berhasil tersimpan", ToastAndroid.SHORT);
      RNFetchBlob.android.actionViewIntent(path, "text/csv");
    })
    .catch(error => {
      ToastAndroid.show("File laporan gagal tersimpan", ToastAndroid.SHORT);
    });
  }

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
          <Right style={{ flex: 1 }}>
            <Button
              onPress={() => this.saveCSV()}
              transparent
              rounded
            >
              <Icon name="print" />
            </Button>
          </Right>
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

const mapStateToProps = state => ({
  categories: state.categories,
  transactions: state.transactions
});

export default connect(
  mapStateToProps,
  null
)(DetailReport);
