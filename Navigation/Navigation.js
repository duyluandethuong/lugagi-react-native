'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons'); //https://github.com/oblador/react-native-vector-icons

var LugagiHome = require('../Pages/LugagiHome.js');
var SearchPage = require('../Pages/SearchPage.js');
var LoginPage = require('../Pages/LoginPage.js');
var More = require('../Pages/More.js');
var SuggestionSelection = require('../Pages/SuggestionSelection.js');

var AddNewFood = require('../Pages/AddNewFood.js');
var FoodDetail = require('../Pages/FoodDetail.js');
var EditFoodDetail = require('../Pages/EditFoodDetail.js');

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
  ActionSheetIOS,
  StatusBar,
  TouchableOpacity
} = React;

var NavigationBarRouteMapper = {
  LeftButton(route, navigator, index, navState) {
    if(index > 0) {
      return (
        <TouchableOpacity
          onPress={() => { if (index > 0) { navigator.pop() } }}>
          <Icon name="chevron-left" style={lugagistyle.navBarLeftText}/>
        </TouchableOpacity>)
    } 
    else { return null }
  },
  RightButton(route, navigator, index, navState) {
    if (route.onPress) return (
      <TouchableOpacity
         onPress={ () => route.onPress() }>
         <Text>
              { route.rightText || 'Right Button' }
         </Text>
       </TouchableOpacity>)
  },
  Title(route, navigator, index, navState) {
    return <Text style={lugagistyle.navBarTitle}>{route.title}</Text>
  }
};

var Navigation = React.createClass({

  render: function() {
    
    var navBar = (
        <Navigator.NavigationBar 
          style={lugagistyle.navBar} 
          routeMapper={ NavigationBarRouteMapper }>
        </Navigator.NavigationBar>  
      );

    return (
      <Navigator 
        initialRoute={{id: 'LugagiHome', title: 'Trang chủ'}}
        renderScene={this.renderScene}
        navigationBar={navBar}/>
    );
  },

  renderScene: function(route, navigator) {
    switch (route.id) {
      case 'LugagiHome':
        return (<LugagiHome navigator={navigator} title="Trang chủ"/>);
      case 'FoodDetail':
        return (<FoodDetail navigator={navigator} title="Món ăn" passProps={route.passProps}/>);
      case 'EditFoodDetail':
        return (<EditFoodDetail navigator={navigator} title="Sửa thông tin" passProps={route.passProps}/>);
    }
  },
});

module.exports = Navigation;
