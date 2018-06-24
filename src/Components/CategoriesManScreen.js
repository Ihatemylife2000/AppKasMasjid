import React, { Component } from "react";
import { connect } from "react-redux";
import { View, StyleSheet, FlatList, ScrollView } from 'react-native';
import { ListSection, FAB, Toolbar, ToolbarBackAction, ToolbarContent, ToolbarAction, Colors, ListItem, Divider } from "react-native-paper";

class CategoriesManScreen extends Component {
  _renderItem = ({ item }) => (
    <ListItem title={item.name} />
  );

  _keyExtractor = item => item.id.toString();

  _addNavigation = () => this.props.navigation.navigate("Entry");

  _drawerOpen = () => this.props.navigation.navigate("DrawerOpen");

  render() {
    const { categories } = this.props;
    return(
      <View style={styles.container}>
        <Toolbar>
          <ToolbarAction icon="menu" onPress={this._drawerOpen} />
          <ToolbarContent
            title="Kategori"
          />
        </Toolbar>
        <ScrollView>
          <ListSection title="Pemasukan">
            <FlatList
              contentContainerStyle={{ backgroundColor: Colors.white }}
              renderItem={this._renderItem}
              keyExtractor={this._keyExtractor}
              data={categories.filter(item => item.type === 1)}
            />
          </ListSection>
          <Divider />
          <ListSection title="Pengeluaran">
           <FlatList
             contentContainerStyle={{ backgroundColor: Colors.white }}
             renderItem={this._renderItem}
             keyExtractor={this._keyExtractor}
             data={categories.filter(item => item.type === 2)}
           />
          </ListSection>
        </ScrollView>
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
  categories: state.categories
});

export default connect(
  mapStateToProps,
  null
)(CategoriesManScreen);
