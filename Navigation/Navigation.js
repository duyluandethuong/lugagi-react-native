'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons'); //https://github.com/oblador/react-native-vector-icons

var LugagiHome = require('../Pages/LugagiHome.js');

var LoginPage = require('../Pages/LoginPage.js');
var More = require('../Pages/More.js');

var SuggestionSelection = require('../Pages/SuggestionSelection.js');
var IngredientSelection = require('../Pages/IngredientSelection.js');
var WeekMenuSuggestion = require('../Pages/WeekMenuSuggestion.js');

var AddNewFood = require('../Pages/AddNewFood.js');
var FoodDetail = require('../Pages/FoodDetail.js');
var EditFoodDetail = require('../Pages/EditFoodDetail.js');

var CollectionDetail = require('../Pages/CollectionDetail.js');

var SearchPage = require('../Pages/SearchPage.js');
var SearchResults = require('../Pages/SearchResults');

var More = require('../Pages/More.js');

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

  getInitialState: function() {
    return {
      initialRouteId: this.props.initialRoute.id,
      initialRouteTitle: this.props.initialRoute.title,
    };
  },

  configureScene: function(route, routeStack) {
    if(route.type == 'Modal') {
      return Navigator.SceneConfigs.FloatFromBottom;
    }
    else {
      return Navigator.SceneConfigs.PushFromRight ;
    }
  },

  render: function() {
    
    var navBar = (
        <Navigator.NavigationBar 
          style={lugagistyle.navBar} 
          routeMapper={ NavigationBarRouteMapper }>
        </Navigator.NavigationBar>  
      );

    return (
      <Navigator 
        configureScene={ this.configureScene }
        initialRoute={{id: this.state.initialRouteId, title: this.state.initialRouteTitle}}
        renderScene={this.renderScene}
        navigationBar={navBar}/>
    );
  },

  renderScene: function(route, navigator) {

    switch (route.id) {
      case 'LugagiHome':
        return (<LugagiHome navigator={navigator} title="Trang chủ"/>);
      case 'AddNewFood':
        return (<AddNewFood navigator={navigator} title="Món ăn" passProps={route.passProps}/>);
      case 'FoodDetail':
        return (<FoodDetail navigator={navigator} title="Món ăn" passProps={route.passProps}/>);
      case 'EditFoodDetail':
        return (<EditFoodDetail navigator={navigator} title="Sửa thông tin" passProps={route.passProps}/>);
      
      case 'CollectionDetail':
        return (<CollectionDetail navigator={navigator} title="Trang chủ" passProps={route.passProps}/>);

      case 'SuggestionSelection':
        return (<SuggestionSelection navigator={navigator} title="Bạn muốn gợi ý theo kiểu nào?" passProps={route.passProps}/>);
      case 'IngredientSelection':
        return (<IngredientSelection navigator={navigator} title="Bạn muốn gợi ý theo kiểu nào?" passProps={route.passProps}/>);
      case 'WeekMenuSuggestion':
        return (<WeekMenuSuggestion navigator={navigator} title="Bạn muốn gợi ý theo kiểu nào?" passProps={route.passProps}/>);

      case 'SearchPage':
        return (<SearchPage navigator={navigator} title="Trang chủ" passProps={route.passProps}/>);
      case 'SearchResults':
        return (<SearchResults navigator={navigator} title="Trang chủ" passProps={route.passProps}/>);

      case 'More':
        return (<More navigator={navigator} title="Trang chủ" passProps={route.passProps}/>);
    }
  },
});

module.exports = Navigation;
