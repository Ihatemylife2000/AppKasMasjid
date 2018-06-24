import React, { Component } from "react";
import {
  Container,
  Content,
  Button,
  Icon,
  Text,
  Header,
  Title,
  Left,
  Right,
  Body,
  Tabs,
  Tab,
  List,
  ListItem,
  Fab
} from "native-base";
import { TouchableNativeFeedback } from "react-native";
import { connect } from "react-redux";

class Categories extends Component {
  render() {
    const { navigation, categories } = this.props;
    const set = navigation.getParam("set");
    return(
      <Container>
        <Header hasTabs>
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
            <Title>Pilih Kategori</Title>
          </Body>
          <Right style={{ flex: 1 }}>
            <Button
              onPress={() => navigation.navigate("SearchCat", {set})}
              transparent
              rounded
            >
              <Icon name="search" />
            </Button>
          </Right>
        </Header>
        <Tabs prerenderingSiblingsNumber={Infinity}>
          <Tab heading="PEMASUKAN">
            <Content>
            <List
              dataArray={categories}
              renderRow={(item, index) =>
                item.type === 1 &&
                  <ListItem
                    key={index}
                    button
                    onPress={() => {
                      set(item);
                      navigation.goBack();
                    }}
                  >
                    <Text>{item.name}</Text>
                  </ListItem>
              }
            >
            </List>
            </Content>
          </Tab>
          <Tab heading="PENGELUARAN">
            <Content>
              <List
                dataArray={categories}
                renderRow={(item, index) =>
                  item.type === 2 &&
                    <ListItem
                      key={index}
                      button
                      onPress={() => {
                        set(item);
                        navigation.goBack();
                      }}
                    >
                      <Text>{item.name}</Text>
                    </ListItem>
                }
              >
              </List>
            </Content>
          </Tab>
        </Tabs>
        <Fab
          direction="up"
          style={{ backgroundColor: "#527A52" }}
          position="bottomRight"
          useForeground
          background={TouchableNativeFeedback.Ripple("rgba(256, 256, 256, 0.3)", true)}
          onPress={() => navigation.navigate("EntryCat")}
        >
          <Icon name="add" />
        </Fab>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  categories: state.categories
});

export default connect(
  mapStateToProps,
  null
)(Categories);
