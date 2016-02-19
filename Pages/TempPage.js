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
  Component,
  ScrollView,
  AsyncStorage,
  NavigatorIOS
} = React;

var styles = StyleSheet.create({
  appBodyContainer: {
    paddingTop: 10,
    flex: 1
  }
});

var TempPage = React.createClass({
 
  getInitialState: function() {
    return {
        directTo: this.props.directTo,
        directToContentID: this.props.directToContentID,
        directToTitle: this.props.directToTitle,
    };
  },

  componentDidMount: function() {

  },

  render: function() {
    var MyView;

    if (this.state.directTo == "FoodDetail") {
      MyView = FoodDetail;
    }

    return (
      <NavigatorIOS
        initialRoute={{
          component: MyView,
          title: 'My View Title',
          passProps: { foodID: this.state.directToContentID },
        }}
      />
    );
  },
 
});

module.exports = TempPage;