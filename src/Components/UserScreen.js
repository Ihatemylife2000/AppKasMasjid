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
  Fab
} from "native-base";
import { connect } from "react-redux";
import { View, StyleSheet, FlatList } from "react-native";
import { FAB, Toolbar, ToolbarBackAction, ToolbarContent, ToolbarAction, Colors, ListItem, Divider } from "react-native-paper";

class UserScreen extends Component {
  _renderItem = ({ item }) => (
    <ListItem
      title={item.name}
      onPress={() => this.props.navigation.navigate("Detail", { id: item.id })}
    />
  );

  _keyExtractor = item => item.id.toString();

  _addNavigation = () => this.props.navigation.navigate("Entry");

  _drawerOpen = () => this.props.navigation.navigate("DrawerOpen");

  render() {
    return (
      <View style={styles.container}>
        <Toolbar>
          <ToolbarAction icon="menu" onPress={this._drawerOpen} />
          <ToolbarContent
            title="Pengurus"
          />
        </Toolbar>
        <FlatList
          contentContainerStyle={{ backgroundColor: Colors.white }}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          ItemSeparatorComponent={Divider}
          data={this.props.user}
        />
        <FAB
          style={{
            position: "absolute",
            top: undefined,
            bottom: 20,
            left: undefined,
            right: 20
          }}
          icon="add"
          onPress={this._addNavigation}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white
  }
});

const mapStateToProps = state => ({
  user: state.user
});

export default connect(
  mapStateToProps,
  null
)(UserScreen);
