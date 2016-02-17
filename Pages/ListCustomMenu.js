'use strict';
 
var React = require('react-native');
var WeekMenuSuggestion = require('./WeekMenuSuggestion.js');

var {
  StyleSheet,
  Image, 
  View,
  TouchableHighlight,
  ListView,
  Text,
  Component
} = React;

var styles = StyleSheet.create({
  thumb: {
    width: 80,
    height: 80,
    marginRight: 10
  },
  textContainer: {
    flex: 1
  },
  separator: {
    height: 1,
    backgroundColor: '#dddddd'
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#48BBEC'
  },
  description: {
    color: '#dddddd',
  },
  rowContainer: {
    flexDirection: 'row',
    padding: 10
  }
});

var ListCustomMenu = React.createClass({
  
  getInitialState: function() {
    return {
        currentUserID: this.props.currentUserID,
        listCustomMenuDataSource: new ListView.DataSource(
          {rowHasChanged: (r1, r2) => r1 !== r2})
    };
  },

  componentDidMount: function() {
    this.getListCustomMenu();
  },

  getListCustomMenu: function() {
    var searchURL = "http://lugagi.com/script/smartPhoneAPI/suggestion/weekMenuSuggestion/listMenuSuggestion.php";
    var fetchBody = "UserID=" + this.state.currentUserID;

    //Display the loading icon
    this.setState({ isLoading: true });

    fetch(searchURL, {method: "POST", body: fetchBody})
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          listCustomMenuDataSource: this.state.listCustomMenuDataSource.cloneWithRows(responseData.ListCustomMenu)
        });
      })
      .done(() => {
        //Hide the loading icon
        this.setState({ isLoading: false });
      });
  },

  renderRow: function(content) {
    return (
        <TouchableHighlight 
            underlayColor='#dddddd'
            onPress={() => this.contentItemPresses(content.MenuID)}>
          <View>
            <View style={styles.rowContainer}>
              <Image style={styles.thumb} source={{uri: content.MenuImageURL}} />
              <View  style={styles.textContainer}>
                <Text style={styles.title}>{content.MenuName}</Text>
              </View>
            </View>
            <View style={styles.separator}/>
          </View>
        </TouchableHighlight>
      );
  },

  //Navigate to the food page
  contentItemPresses: function(contentID) {
      this.props.navigator.push({
        title: 'Gợi ý',
        component: WeekMenuSuggestion,
        passProps: {menuID: contentID}
      });
  },

  render: function() {
    return (
      <ListView
        dataSource={this.state.listCustomMenuDataSource}
        renderRow={this.renderRow}/>
    );
  }
 
});

module.exports = ListCustomMenu;