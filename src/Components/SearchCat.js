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
  List,
  ListItem,
  Input,
  Item
} from "native-base";
import { connect } from "react-redux";

class SearchCat extends Component {
  state = {
    searchText: ""
  };

  componentDidMount() {
    this.inputSearch._root.focus();
  }

  search(name) {
    const data_name = name.toUpperCase();
    const search_text = this.state.searchText.toUpperCase();
    return data_name.indexOf(search_text) > -1;
  }

  render() {
    const { navigation, categories } = this.props;
    const set = navigation.getParam("set");
    return (
      <Container>
        <Header searchBar rounded>
          <Item>
            <Button
              onPress={() => navigation.goBack()}
              androidRippleColor="rgba(0, 0, 0, 0.15)"
              transparent
              rounded
            >
              <Icon name="arrow-back" style={{ color: "#777" }} />
            </Button>
            <Input
              ref={c => this.inputSearch = c}
              autoCapitalize="none"
              placeholder="Cari Kategori"
              value={this.state.searchText}
              onChangeText={searchText => this.setState({searchText})}
            />
            {this.state.searchText !== "" &&
               <Button
                  onPress={() => this.setState({ searchText: "" })}
                  androidRippleColor="rgba(0, 0, 0, 0.15)"
                  transparent
                  rounded
                >
                  <Icon name="close" style={{ color: "#777" }} />
                </Button>}
          </Item>
        </Header>
        <Content>
          <List>
            {
              categories.map((item, index) =>
                this.search(item.name) &&
                  <ListItem
                    key={index}
                    button
                    noBorder
                    onPress={() => {
                      set(item);
                      navigation.pop(2);
                    }}
                  >
                    <Left>
                      <Text>{item.name}</Text>
                    </Left>
                  </ListItem>
              )
            }
          </List>
        </Content>
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
)(SearchCat);
