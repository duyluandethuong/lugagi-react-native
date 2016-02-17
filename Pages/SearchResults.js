'use strict';
 
var React = require('react-native');
var FoodDetail = require('./FoodDetail.js');

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

class SearchResults extends Component {
 
  constructor(props) {
    super(props);
    var dataSource = new ListView.DataSource(
      {rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: dataSource.cloneWithRows(this.props.searchResultDataSource)
    };
  }
 
  renderRow(content) {
    var fullImageURL = "http://lugagi.com" + content.ImageURL;
    return (
        <TouchableHighlight 
            underlayColor='#dddddd'
            onPress={() => this.contentItemPresses(content.MonAnID, "food")}>
          <View>
            <View style={styles.rowContainer}>
              <Image style={styles.thumb} source={{uri: fullImageURL}} />
              <View  style={styles.textContainer}>
                <Text style={styles.title}>{content.MonAnName}</Text>
                <Text style={styles.description} 
                      numberOfLines={3}>{content.MonAnDescription}</Text>
              </View>
            </View>
            <View style={styles.separator}/>
          </View>
        </TouchableHighlight>
      );
  }

  //Navigate to the food page
  contentItemPresses(contentID, contentType) {
    if (contentType == "food" || contentType == "") {
      this.props.navigator.push({
        title: 'Món ăn',
        component: FoodDetail,
        passProps: {foodID: contentID}
      });
    }
  }

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderRow.bind(this)}/>
    );
  }
 
}

module.exports = SearchResults;