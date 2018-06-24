import React, { Component } from "react";
import { connect } from "react-redux";
import { View, StyleSheet, FlatList } from "react-native";
import { TouchableRipple, FAB, Card, TextInput, Toolbar, ToolbarBackAction, ToolbarContent, ToolbarAction, Colors } from "react-native-paper";

class CategoriesScreen extends Component {
  _addNavigation = () => this.props.navigation.navigate("EntryCat");

  _back = () => this.props.navigation.goBack();

  _searchNavigation = set => () => this.props.navigation.navigate("SearchCat", { set });

  render() {
    const { navigation, categories } = this.props;
    const set = navigation.getParam("set");
    return(
      <View style={styles.container}>
        <Toolbar>
          <ToolbarBackAction onPress={this._back} />
          <ToolbarContent
            title="Pilih Kategori"
          />
          <ToolbarAction
            icon="search"
            onPress={this._searchNavigation(set)}
          />
        </Toolbar>
        {/*<Tabs>
          <Tab heading="PEMASUKAN">
            <Content>
              <List>
                {
                  categories.map(data =>
                    data.type === 1 &&
                      <ListItem
                        key={data.id}
                        button
                        onPress={() => {
                          set(data);
                          navigation.goBack();
                        }}
                      >
                        <Text>{data.name}</Text>
                      </ListItem>
                  )
                }
              </List>
            </Content>
          </Tab>
          <Tab heading="PENGELUARAN">
            <Content>
              <List>
              {
                categories.map(data =>
                  data.type === 2 &&
                    <ListItem
                      key={data.id}
                      button
                      onPress={() => {
                        set(data);
                        navigation.goBack();
                      }}
                    >
                      <Text>{data.name}</Text>
                    </ListItem>
                )
              }
              </List>
            </Content>
          </Tab>
        </Tabs>*/}
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
)(CategoriesScreen);
