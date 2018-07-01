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
  CardItem,
} from "native-base";
import {
  TouchableNativeFeedback,
  StyleSheet,
  DatePickerAndroid,
  ToastAndroid
} from "react-native";
import { TRANSACTIONS_URL } from "../Config/URLs";
import { connect } from "react-redux";
import { logout } from "../Actions";
import dateFormat from "dateformat";
import axios from "axios";
import "intl";
import "intl/locale-data/jsonp/id";

const datef = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric"
});

class EditTrans extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: dateFormat(new Date(), "yyyy-mm-dd"),
      description: "",
      value: "",
      categories_id: null,
      categories_type: 0,
      categories_name: "Kategori"
    };
  }

  componentDidUpdate(prevProps) {
    const { transactions, navigation } = this.props;
    if (transactions !== prevProps.transactions) {
      const id = navigation.getParam("id");
      const data = transactions.find(data => data.id === id);
      if(!data)
        navigation.pop(2);
    }
  }

  componentDidMount() {
    const { navigation, transactions, categories } = this.props;
    const id = navigation.getParam("id");
    const data = transactions.find(data => data.id === id);
    const cat = categories.find(cat => cat.id === data.categories_id);
    this.setState({
      ...data,
      categories_type: cat.type,
      categories_name: cat.name
    });
  }

  setCategoryValue(categories) {
    this.setState({
      categories_id: categories.id,
      categories_type: categories.type,
      categories_name: categories.name
    });
  }

  validateValue = () => this.state.value === "" || this.state.value === 0;

  validateCategories = () => this.state.categories_id === null;

  onUpdate = () => {
    const { navigation, auth } = this.props;
    if(this.validateValue()) {
      ToastAndroid.show("Nominal uang tidak boleh kosong atau 0 (nol)", ToastAndroid.SHORT);
      return;
    } else if(this.validateCategories()) {
      ToastAndroid.show("Anda harus memilih kategori", ToastAndroid.SHORT);
      return;
    }

    const putData = {
      date: this.state.date,
      description: this.state.description,
      value: this.state.value,
      categories_id: this.state.categories_id
    };

    const putHeader = {
      headers: {
        Authorization : `Bearer ${auth.access_token}`
      }
    };

    axios.put(`${TRANSACTIONS_URL}/${this.state.id}`, putData, putHeader)
    .then(response => {
      navigation.goBack();
      ToastAndroid.show("Anda berhasil mengubah transaksi", ToastAndroid.SHORT);
    })
    .catch(error => {
      if(!error.response) {
        ToastAndroid.show("Tidak bisa terhubung ke server", ToastAndroid.SHORT);
      } else if(error.response.status === 401) {
        ToastAndroid.show("Autentikasi gagal", ToastAndroid.SHORT);
        logout();
      }
    });
  };

  showDateTimePicker = async () => {
    const { action, year, month, day } = await DatePickerAndroid.open({
      date: new Date(this.state.date)
    });
    if (action !== DatePickerAndroid.dismissedAction) {
      this.setState({
        date: dateFormat(new Date(year, month, day), "yyyy-mm-dd")
      });
    }
  };

  render() {
    const { navigation } = this.props;
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
            <Title>Ubah Transaksi</Title>
          </Body>
          <Right style={{ flex: 2 }}>
            <Button
              onPress={this.onUpdate}
              hasText
              transparent
            >
              <Text>Simpan</Text>
            </Button>
          </Right>
        </Header>
        <Content>
          <Card style={styles.card}>
            <CardItem>
              <Icon name="cash" style={styles.icon} />
              <Item>
                <Input
                  keyboardType="numeric"
                  style={{
                    color: this.state.categories_type === 0 ? "#00898e"
                      : this.state.categories_type === 1 ? "#1F88A7"
                          : "#B9264F"
                  }}
                  placeholder="Rp0"
                  value={this.state.value.toString()}
                  onChangeText={value => this.setState({
                    value: parseInt(value) || ""
                  })}
                />
              </Item>
            </CardItem>
            <CardItem>
              <Icon name="list" style={styles.icon} />
              <Item>
                <Input
                  autoCapitalize="none"
                  placeholder="Catatan"
                  value={this.state.description}
                  onChangeText={description => this.setState({description})}
                />
              </Item>
            </CardItem>
            <TouchableNativeFeedback
              onPress={() => navigation.navigate("Categories", {
                set: this.setCategoryValue.bind(this)
              })}
            >
              <CardItem>
                <Icon name="apps" style={styles.icon} />
                <Item disabled>
                  <Input
                    disabled
                    value={this.state.categories_name}
                  />
                </Item>
              </CardItem>
            </TouchableNativeFeedback>
            <TouchableNativeFeedback onPress={this.showDateTimePicker}>
              <CardItem>
                <Icon name="calendar" style={styles.icon} />
                <Item disabled>
                  <Input
                    disabled
                    value={datef.format(new Date(this.state.date))}
                    onChangeText={date => this.setState({date})}
                  />
                </Item>
              </CardItem>
            </TouchableNativeFeedback>
          </Card>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    marginTop: 0,
    marginBottom: 15
  },
  icon: {
    width: 30,
    color: "#777"
  }
});

const mapStateToProps = state => ({
  transactions: state.transactions,
  categories: state.categories,
  auth: state.auth
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout())
});

export default connect(
  mapStateToProps,
  null
)(EditTrans);
