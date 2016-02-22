'use strict';
 
var React = require('react-native');
var lugagistyle = require('../Styles/lugagistyle.js');

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
  rowContainer: {
    flexDirection: 'row',
    padding: 10
  }
});

var SearchResults = React.createClass({

  getInitialState: function() {

    var dataSource = new ListView.DataSource(
                      {rowHasChanged: (r1, r2) => r1 !== r2});

    return {
        dataSource: dataSource.cloneWithRows(this.props.passProps.searchResultDataSource),
    };

  },
 
  renderRow: function(content) {
    var fullImageURL = "http://lugagi.com/script/timthumb.php?src=" + content.ImageURL + "&w=200&h=200&q=50";
    return (
        <TouchableHighlight 
            underlayColor='#dddddd'
            onPress={() => this.contentItemPresses(content.MonAnID, "food")}>
          <View>
            <View style={styles.rowContainer}>
              <Image style={styles.thumb} source={{uri: fullImageURL}} />
              <View  style={styles.textContainer}>
                <Text style={[lugagistyle.textTitle]}>{content.MonAnName}</Text>
                <Text/>
                <Text style={lugagistyle.textMuted} 
                      numberOfLines={3}>{content.MonAnDescription}</Text>
              </View>
            </View>
            <View style={styles.separator}/>
          </View>
        </TouchableHighlight>
      );
  },

  //Navigate to the food page
  contentItemPresses: function(contentID, contentType) {
    if (contentType == "food" || contentType == "") {
      this.props.navigator.push({
        title: 'Món ăn',
        id: 'FoodDetail',
        passProps: {foodID: contentID}
      });
    }
  },

  render: function() {
    return (
      <ListView
        style={lugagistyle.appBodyContainer}
        dataSource={this.state.dataSource}
        renderRow={this.renderRow.bind(this)}/>
    );
  }
 
});

module.exports = SearchResults;