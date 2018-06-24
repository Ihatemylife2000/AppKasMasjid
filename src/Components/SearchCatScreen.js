import React, { Component } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { ListItem, Searchbar, TouchableRipple, FAB, Card, TextInput, Toolbar, ToolbarBackAction, ToolbarContent, ToolbarAction, Colors } from "react-native-paper";
import { connect } from "react-redux";

class SearchCatScreen extends Component {
  state = {
    searchText: ""
  };

  componentDidMount() {
    this.inputSearch._root.focus();
  }

  search = name => {
    const data_name = name.toUpperCase();
    const search_text = this.state.searchText.toUpperCase()
    return data_name.indexOf(search_text) > -1;
  };

  _renderItem = ({ item }) => (
    <ListItem
      title={item.name}
      icon="search"
      onPress={() => {
        this.props.navigation.state.params.set(item);
        this.props.navigation.pop(2);
      }}
    />
  );

  _keyExtractor = item => item.id.toString();

  _back = () => this.props.navigation.goBack();

  render() {
    return (
      <View style={styles.container}>
          <Searchbar
            ref={c => this.inputSearch = c}
            placeholder="Cari"
            onChangeText={searchText => this.setState({searchText})}
            value={this.state.searchText}
            onIconPress={this._back}
            icon="arrow-back"
          />
        <FlatList
          contentContainerStyle={{ backgroundColor: Colors.white }}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          data={this.props.categories.filter(item => this.search(item.name))}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white
  },
  card: {
    margin: 0
  }
});

const mapStateToProps = state => ({
  categories: state.categories
});

export default connect(
  mapStateToProps,
  null
)(SearchCatScreen);
