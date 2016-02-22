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
  AsyncStorage,
  Dimensions
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
      collectionName: null,
      winWidth: null,
      itemWidth: null,
      textWidth: null,
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
        numOfItems: responseData.Collection.Content.length,
      });
    })
    .done(() => {
      var collectionInfo = this.state.collectionInfo
      this.setState({
        collectionName: collectionInfo.CollectionName,
        collectionDesc: collectionInfo.CollectionDescription,
        userImageURL: collectionInfo.UserProfileImageURL,
        loaded: true,
      });
      console.log(this.state.collectionName);
    });
  },

  renderCollectionContent: function(content){
    var fullImageURL = content.ContentImageURL.replace("foodimages","script/timthumb.php?src=/foodimages") + "&w=300&h=200";
    return (
      <TouchableOpacity underlayColor='rgba(0,0,0,0)' 
        onPress={() => this.contentItemPresses(content.ContentID, content.ContentType)}>
        <View style={{margin: this.state.itemMargin}}>
          <View style={collectionStyles.row}>
            <View style={{height: this.state.itemWidth + 50, width: this.state.itemWidth}}>
              <Image
                source={{uri: fullImageURL}}
                style={{
                  height: this.state.itemWidth,
                  width: this.state.itemWidth,
                }}/>
              <Text style={collectionStyles.contentName} numberOfLines={2}>{content.ContentName}</Text>
            </View>
          </View> 
        </View>
      </TouchableOpacity>
    );
  },

  contentItemPresses: function(contentID, contentType) {
    if (contentType == "food" || contentType == "") {
      this.props.navigator.push({
        title: 'Món ăn',
        id: 'FoodDetail',
        passProps: {foodID: contentID}
      });
    }
  },

  updateLayout: function(event){
    var winWidth = event.nativeEvent.layout.width;
    this.setState({
      winWidth: winWidth,
    })
    var itemWidth = this.state.itemWidth;
    if (winWidth < 768 ){
      this.setState({
        itemWidth: winWidth * .48,
        itemMargin: winWidth * .009,
        textWidth: winWidth * .7
      })  
    } else if (winWidth < 1024) {
      this.setState({
        itemWidth: winWidth * .22,
        itemMargin: winWidth * .014,
        textWidth: winWidth * .65
      })  
    } else if (winWidth >= 1024) {
      this.setState({
        itemWidth: winWidth * .18,
        itemMargin: winWidth * .009,
        textWidth: winWidth * .5
      })  
    }
    
    console.log(winWidth);
    
  },

  render: function() {
    return (
      <ScrollView 
          style={lugagistyle.appBodyContainer}
          onLayout={(event)=> this.updateLayout(event)} style={collectionStyles.pageContainer}>
        <View style={collectionStyles.collectionInfo}>
          <View style={{width:70,height:70, margin: this.state.itemMargin}}>
            <Image source={{uri: this.state.userImageURL}} style={collectionStyles.roundThumb}/>
          </View>
          <View style={{flexDirection: 'column', alignSelf: 'center', width: this.state.textWidth}}>
            <Text style={[lugagistyle.textPrimary, lugagistyle.sectionTitle]}>{this.state.collectionName}</Text>
            <Text style={{flexWrap: 'wrap'}}>{this.state.collectionDesc}</Text>
          </View>
        </View>
        <ListView contentContainerStyle={collectionStyles.list} initialListSize={this.state.numOfItems}
          dataSource={this.state.collectionDataSource}
          renderRow={this.renderCollectionContent}/>
      </ScrollView>
    )
  }
});

var collectionStyles = StyleSheet.create({
  pageContainer: {
    
  },
  collectionInfo: {
    flexDirection: 'row',
    padding: 10
  },
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    
  },
  row: {
    justifyContent: 'center',
    backgroundColor: '#F6F6F6',
    alignItems: 'center',

  },
  thumb: {
    
  },
  roundThumb: {
    width: 70,
    height: 70,
    borderRadius: 35
  },
  contentName: {
    padding: 6
  }
})

//Export the class and permit its use in other files
module.exports = CollectionDetail;