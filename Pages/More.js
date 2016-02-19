'use strict';
 
var React = require('react-native');
var LoginPage = require('./LoginPage.js');
var ListCustomMenu = require('./ListCustomMenu.js');

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
  AlertIOS
} = React;

var styles = StyleSheet.create({
  appBodyContainer: {
    paddingTop: 10,
    flex: 1
  },
  menuList: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
  },
  menuListText: {
    marginTop: 5,
    marginLeft: 10,
  },
  profilePic: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 5,
  },
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

var More = React.createClass({
 
  getInitialState: function() {
    return {
        selectedTab: "featured",
        currentUserID: null,
        currentUsername: null,
        currentUserProfileImageURL: null,
    };
  },

  componentDidMount: function() {
    this.getCurrentUser("currentUserID");
    this.getCurrentUser("currentUsername");
    this.getCurrentUser("currentUserProfileImageURL");
  },

  //Async function to get current user information
  async getCurrentUser(keyName) {
    try {
      var value = await AsyncStorage.getItem(keyName);
      if (value !== null){
        if (keyName == "currentUserID") {
          this.setState({
            currentUserID: value,
          });
        }
        else if (keyName == "currentUsername") {
          this.setState({
            currentUsername: value,
          });
        }
        else if (keyName == "currentUserProfileImageURL") {
          this.setState({
            currentUserProfileImageURL: value,
          });
        }

      } else {
        
      }
    } catch (error) {
      //error.message
    }
  },

  async deleteCurrentUser(keyName) {
    try {
      await AsyncStorage.removeItem(keyName);

    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }
  },

  logOutConfirm: function() {
    AlertIOS.alert(
      'Đăng xuất',
      'Bạn có chắc là muốn đăng xuất khỏi Lugagi?',
      [
        {text: 'Có', onPress: this.logOutProcess},
        {text: 'Không', onPress: () => console.log('Bar Pressed!')},
      ]
    );
  },

  logOutProcess: function() {
    this.deleteCurrentUser("currentUserID");
    this.deleteCurrentUser("currentUsername");
    this.deleteCurrentUser("currentUserProfileImageURL");
    
    //Clear the state to make the page re-render itself
    this.setState({
      currentUserID: null,
      currentUsername: null,
      currentUserProfileImageURL: null,
    });
  },

  logInProcess: function() {
    this.props.navigator.push({
        name: 'Đăng nhập',
        component: LoginPage,
    });
  },

  listCustomMenu: function() {
    this.props.navigator.push({
        name: 'Thực đơn đã tạo',
        component: ListCustomMenu,
        passProps: { currentUserID: this.state.currentUserID },
    });
  },

  render: function() {
    var test = ["xxx", "yyy", "zzz"];
    var ScrollViewList = [];
    
    //Render login logout button according to the state of the current user
    if (this.state.currentUserID) {
      var CurrentUserMenuListItem = (
        <TouchableHighlight underlayColor='#99d9f4' key={test[0]}>
          <View style={styles.menuList}>
            <Image source={{uri: this.state.currentUserProfileImageURL}}
                style={styles.profilePic}/>
            <Text style={styles.menuListText}>{this.state.currentUsername}</Text>
          </View>
        </TouchableHighlight>
      );

      var LoginLogoutMenuListItem = (
          <TouchableHighlight underlayColor='#99d9f4' onPress={this.logOutConfirm} key={test[1]}>
            <View style={styles.menuList}>
              <Image source={{uri: this.state.currentUserProfileImageURL}}
                  style={styles.profilePic}/>
              <Text style={styles.menuListText}>Đăng xuất</Text>
            </View>
          </TouchableHighlight>
      );

      var ListCustomMenuItem = (
          <TouchableHighlight underlayColor='#99d9f4' onPress={this.listCustomMenu} key={test[2]}>
            <View style={styles.menuList}>
              <Image source={{uri: this.state.currentUserProfileImageURL}}
                  style={styles.profilePic}/>
              <Text style={styles.menuListText}>Xem các thực đơn đã tạo</Text>
            </View>
          </TouchableHighlight>
      );

      ScrollViewList.push(CurrentUserMenuListItem);
      ScrollViewList.push(LoginLogoutMenuListItem);
      ScrollViewList.push(ListCustomMenuItem);

    }
    else {
      var LoginLogoutMenuListItem = (
          <TouchableHighlight underlayColor='#99d9f4' onPress={this.logInProcess} key={test[2]}>
            <View style={styles.menuList}>
              <Image source={{uri: this.state.currentUserProfileImageURL}}
                  style={styles.profilePic}/>
              <Text style={styles.menuListText}>Đăng nhập</Text>
            </View>
          </TouchableHighlight>
      );

      ScrollViewList.push(LoginLogoutMenuListItem);
    }

    //Final render for the whole list of options on this page
    return (
      <ScrollView style={styles.appBodyContainer}>

        {ScrollViewList}

      </ScrollView>
    );
  }
 
});

module.exports = More;