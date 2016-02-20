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

var NavigationBar = require('./NavigationBar.js');

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

var Navigation = React.createClass({

  render: function() {
    
    var lugagiNavBar = (
        <View style={lugagistyle.navBar} >
            <StatusBar
               backgroundColor={"blue"}
               barStyle={"default"}
               translucent={false}
               style={lugagistyle.statusBar}/>
            <View>
                <TouchableOpacity>
                  <Text>Back</Text>
                </TouchableOpacity>
            </View>
        </View>   
      );

    const routeMapper = {
      LeftButton: (route, navigator, index, navState) => {
        if (index === 0) {
          return null
        }
        const previousRoute = navState.routeStack[index - 1]
        return (
          <TouchableOpacity
            onPress={() => navigator.pop()}>
            <Text style={styles.navText}>
              {previousRoute.title}
            </Text>
          </TouchableOpacity>
        )
      },
      RightButton: (route, navigator, index, navState) => {
        if (route.rightElement) {
          return route.rightElement
        }
      },
      Title: (route, navigator, index, navState) => {
        return (
          <Text style={styles.navText}>{route.title}</Text>
        )
      }
    };

    return (
      <Navigator 
        initialRoute={{id: 'LugagiHome'}}
        renderScene={this.renderScene}
        navigationBar={lugagiNavBar}/>
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
