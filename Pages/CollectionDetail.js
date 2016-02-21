'use strict';
 
//var Swiper = require('react-native-swiper');
var React = require('react-native');
var FoodDetail = require('./FoodDetail.js');
var lugagistyle = require('../Styles/lugagistyle.js');

var {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  TouchableOpacity,
  ActivityIndicatorIOS,
  Image,
  Component,
  AlertIOS,
  ListView,
  ScrollView,
  AsyncStorage
} = React;

var CollectionDetail = React.createClass ({
  getInitialState: function() {
    return {
      currentUserID: null,
      currentUsername: null,
      currentUserProfileImageURL: null,
      loaded: false,
      collectionID: this.props.collectionID,
      collectionDataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
    }
  },

  componentDidMount: function() {
    this.getCollectionContent();
  },

  getCollectionContent: function(){
    var fetchParam = "?UserCollectionID=" + this.state.collectionID;
    fetch("http://lugagi.com/script/collection/getCollectionContent.php" + fetchParam, {method: 'GET'})
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({
        collectionInfo: responseData.Collection,
        collectionDataSource: this.state.collectionDataSource.cloneWithRows(responseData.Collection.Content),
        loaded: true,
      });
    })
    .done();
  },

  renderCollectionContent: function(content){
    var fullImageURL = content.ContentImageURL.replace("foodimages","script/timthumb.php?src=/foodimages") + "&w=300&h=200";
    return (
      <TouchableOpacity underlayColor='rgba(0,0,0,0)' 
        onPress={() => this.contentItemPresses(content.ContentID, content.ContentType)}>
                <View style={lugagistyle.listViewItemContainer}>
          <Image
            source={{uri: fullImageURL}}
            style={lugagistyle.thumb}/>
          <Text style={lugagistyle.contentName} numberOfLines={2}>{content.ContentName}</Text>
        </View>
      </TouchableOpacity>
    );
  },

  contentItemPresses: function(contentID, contentType) {
    if (contentType == "food" || contentType == "") {
      this.props.navigator.push({
        title: 'Món ăn',
        component: FoodDetail,
        passProps: {foodID: contentID}
      });
    }
  },

  render: function() {
    return (
      <ScrollView style={lugagistyle.appBodyContainer}>
        <View>
          <ListView
            dataSource={this.state.collectionDataSource}
            renderRow={this.renderCollectionContent}/>
        </View>
      </ScrollView>
    )
  }
});

var collectionStyles = StyleSheet.create({

})

//Export the class and permit its use in other files
module.exports = CollectionDetail;