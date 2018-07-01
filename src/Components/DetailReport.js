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
import { ToastAndroid } from "react-native";
import { connect } from "react-redux";
import RNFetchBlob from "rn-fetch-blob";
import ITab from "./ITab";
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
      const value = cat.type === 1 ? b.value : -b.value;
      return value + a;
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
    const sorted = filtered.sort((a, b) => {
      return new Date(a.date) - new Date(b.date)
    });
    const month_yearf = month_year.format(target);
    const path = `${RNFetchBlob.fs.dirs.DownloadDir}/Laporan - ${month_yearf}.csv`;
    const header = `${month_yearf}\n\nTanggal,Kategori,Masuk,Keluar,Saldo,Catatan\n`;
    let totalIncome = 0;
    let totalExpense = 0;
    let balance = this.getOpenBalance();
    const first = `1,Saldo Awal,-,-,${balance},\n`;
    const row = sorted.map(item => {
      const cat = categories.find(cat => cat.id === item.categories_id);
      const income = cat.type === 1 ? item.value : "-";
      const expense = cat.type === 2 ? item.value : "-";
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
