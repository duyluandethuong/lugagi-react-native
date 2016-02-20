'use strict';

var React = require('react-native');

var LugagiHome = require('../Pages/LugagiHome.js');
var SearchPage = require('../Pages/SearchPage.js');
var LoginPage = require('../Pages/LoginPage.js');
var More = require('../Pages/More.js');
var SuggestionSelection = require('../Pages/SuggestionSelection.js');
var AddNewFood = require('../Pages/AddNewFood.js');
var FoodDetail = require('../Pages/FoodDetail.js');
var lugagistyle = require('../Styles/lugagistyle.js');

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TabBarIOS,
  Component,
  AsyncStorage,
  Navigator,
  ActionSheetIOS
} = React;

var Navigation = React.createClass({
  render: function() {


    return (
      <Navigator 
        initialRoute={{id: 'LugagiHome'}}
        renderScene={this.renderScene}
        navigationBar={
          <View style={lugagistyle.navBar} >
              <View>
                  <Text>Back</Text>
              </View>
          </View>         
        }/>
    );
  },

  renderScene: function(route, navigator) {
    switch (route.id) {
      case 'LugagiHome':
        return (<LugagiHome navigator={navigator} title="Trang chủ"/>);
      case 'FoodDetail':
        return (<FoodDetail navigator={navigator} title="Món ăn" passProps={route.passProps}/>);
    }
  },
});

module.exports = Navigation;
