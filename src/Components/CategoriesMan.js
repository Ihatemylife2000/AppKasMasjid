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
  List,
  ListItem,
  Fab
} from "native-base";
import { TouchableNativeFeedback } from "react-native";
import { connect } from "react-redux";

class CategoriesMan extends Component {
  render() {
    const { navigation, categories } = this.props;
    return(
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
            <Title>Kategori</Title>
          </Body>
          <Right style={{ flex: 1 }} />
        </Header>
        <Content>
          <ListItem itemDivider>
            <Text>Pemasukan</Text>
          </ListItem>
          <List
            dataArray={categories}
            renderRow={(item, index) =>
              item.type === 1 &&
                <ListItem key={index}>
                  <Text>{item.name}</Text>
                </ListItem>
            }
          >
          </List>
          <ListItem itemDivider>
            <Text>Pengeluaran</Text>
          </ListItem>
          <List
            dataArray={categories}
            renderRow={(item, index) =>
              item.type === 2 &&
                <ListItem key={index}>
                  <Text>{item.name}</Text>
                </ListItem>
            }
          >
          </List>
        </Content>
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
)(CategoriesMan);
