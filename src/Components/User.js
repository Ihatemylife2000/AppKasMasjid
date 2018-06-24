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
  ListItem,
  List,
  Fab
} from "native-base";
import { TouchableNativeFeedback } from "react-native";
import { connect } from "react-redux";

class User extends Component {
  render() {
    const { navigation, user } = this.props;
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
            <Title>Pengurus</Title>
          </Body>
          <Right style={{ flex: 1 }} />
        </Header>
        <Content>
          <List
            dataArray={user}
            renderRow={(item, index) =>
              <ListItem
                key={index}
                button
                onPress={() => navigation.navigate("DetailUser", {
                  id: item.id
                })}
              >
                <Text>{item.name}</Text>
              </ListItem>
            }
          >
          </List>
        </Content>
        <Fab
          direction="up"
          position="bottomRight"
          useForeground
          background={TouchableNativeFeedback.Ripple("rgba(256, 256, 256, 0.3)", true)}
          style={{ backgroundColor: "#527A52" }}
          onPress={() => navigation.navigate("EntryUser")}
        >
          <Icon name="add" />
        </Fab>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(
  mapStateToProps,
  null
)(User);
