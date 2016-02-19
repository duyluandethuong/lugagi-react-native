/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

 /* https://github.com/oblador/react-native-vector-icons */
'use strict';

var React = require('react-native');

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

//File inclusion
var LugagiHome = require('./Pages/LugagiHome.js');
var SearchPage = require('./Pages/SearchPage.js');
var LoginPage = require('./Pages/LoginPage.js');
var More = require('./Pages/More.js');
var SuggestionSelection = require('./Pages/SuggestionSelection.js');
var AddNewFood = require('./Pages/AddNewFood.js');

var SUGGESTION_OPTIONS = [
  'Gợi ý bằng nguyên liệu',
  'Gợi ý cho cả tuần',
  'Hủy bỏ',
];
var DESTRUCTIVE_INDEX = 2;
var CANCEL_INDEX = 2;

//Navigation bar for the app
var LugagiApp = React.createClass({
  
  getInitialState: function() {
    return {
        selectedTab: "featured"
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

  setTab: function(tabId) {
    this.setState({selectedTab : tabId});
  },

  //Signin button on the right of the navigator
  navigatorRightButtonPress: function() {
    this.refs.nav.push({
        title: 'Đăng nhập',
        component: LoginPage
    });
  },

  render: function() {
    var base64Icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAABLCAQAAACSR7JhAAADtUlEQVR4Ac3YA2Bj6QLH0XPT1Fzbtm29tW3btm3bfLZtv7e2ObZnms7d8Uw098tuetPzrxv8wiISrtVudrG2JXQZ4VOv+qUfmqCGGl1mqLhoA52oZlb0mrjsnhKpgeUNEs91Z0pd1kvihA3ULGVHiQO2narKSHKkEMulm9VgUyE60s1aWoMQUbpZOWE+kaqs4eLEjdIlZTcFZB0ndc1+lhB1lZrIuk5P2aib1NBpZaL+JaOGIt0ls47SKzLC7CqrlGF6RZ09HGoNy1lYl2aRSWL5GuzqWU1KafRdoRp0iOQEiDzgZPnG6DbldcomadViflnl/cL93tOoVbsOLVM2jylvdWjXolWX1hmfZbGR/wjypDjFLSZIRov09BgYmtUqPQPlQrPapecLgTIy0jMgPKtTeob2zWtrGH3xvjUkPCtNg/tm1rjwrMa+mdUkPd3hWbH0jArPGiU9ufCsNNWFZ40wpwn+62/66R2RUtoso1OB34tnLOcy7YB1fUdc9e0q3yru8PGM773vXsuZ5YIZX+5xmHwHGVvlrGPN6ZSiP1smOsMMde40wKv2VmwPPVXNut4sVpUreZiLBHi0qln/VQeI/LTMYXpsJtFiclUN+5HVZazim+Ky+7sAvxWnvjXrJFneVtLWLyPJu9K3cXLWeOlbMTlrIelbMDlrLenrjEQOtIF+fuI9xRp9ZBFp6+b6WT8RrxEpdK64BuvHgDk+vUy+b5hYk6zfyfs051gRoNO1usU12WWRWL73/MMEy9pMi9qIrR4ZpV16Rrvduxazmy1FSvuFXRkqTnE7m2kdb5U8xGjLw/spRr1uTov4uOgQE+0N/DvFrG/Jt7i/FzwxbA9kDanhf2w+t4V97G8lrT7wc08aA2QNUkuTfW/KimT01wdlfK4yEw030VfT0RtZbzjeMprNq8m8tnSTASrTLti64oBNdpmMQm0eEwvfPwRbUBywG5TzjPCsdwk3IeAXjQblLCoXnDVeoAz6SfJNk5TTzytCNZk/POtTSV40NwOFWzw86wNJRpubpXsn60NJFlHeqlYRbslqZm2jnEZ3qcSKgm0kTli3zZVS7y/iivZTweYXJ26Y+RTbV1zh3hYkgyFGSTKPfRVbRqWWVReaxYeSLarYv1Qqsmh1s95S7G+eEWK0f3jYKTbV6bOwepjfhtafsvUsqrQvrGC8YhmnO9cSCk3yuY984F1vesdHYhWJ5FvASlacshUsajFt2mUM9pqzvKGcyNJW0arTKN1GGGzQlH0tXwLDgQTurS8eIQAAAABJRU5ErkJggg==';
    return (
      <TabBarIOS selectedTab={this.state.selectedTab} tintColor='#FF5252'>
        <TabBarIOS.Item 
          systemIcon="featured" 
          selected={this.state.selectedTab === 'featured'}
          onPress={() => {
                            this.setTab("featured");
                          }}>
          <React.NavigatorIOS
            ref="nav"
            style={styles.container}
            tintColor='#FF5252'
            initialRoute={{
              title: 'Trang chủ',
              component: LugagiHome, 
              translucent: true
            }}
          />
        </TabBarIOS.Item>

        <TabBarIOS.Item
          systemIcon="most-viewed" 
          selected={this.state.selectedTab === 'suggestion'}
          onPress={() => {
                            this.setTab("suggestion");
                          }}>
          <React.NavigatorIOS
            ref="suggestionNav"
            style={styles.container}
            tintColor='#FF5252'
            initialRoute={{
              title: 'Gợi ý',
              component: SuggestionSelection,
              translucent: true
            }}
          />
        </TabBarIOS.Item>

        <TabBarIOS.Item
          icon={{uri: base64Icon, scale: 3}}
          title="Tạo mới"
          selected={this.state.selectedTab === 'addNewFood'}
          onPress={() => {
                            this.setTab("addNewFood");
                          }}>
          <React.NavigatorIOS
            ref="addNewFood"
            style={styles.container}
            tintColor='#FF5252'
            initialRoute={{
              title: 'Thêm món mới',
              component: AddNewFood,
              translucent: true
            }}
          />
        </TabBarIOS.Item>

        <TabBarIOS.Item 
          systemIcon="search" 
          selected={this.state.selectedTab === 'search'}
          onPress={() => {
                            this.setTab("search");
                          }}>
          <React.NavigatorIOS
            style={styles.container}
            tintColor='#FF5252'
            initialRoute={{
              title: 'Tìm kiếm',
              component: SearchPage,
              rightButtonTitle: "Test",
              translucent: true
            }}
          />
        </TabBarIOS.Item>

        <TabBarIOS.Item 
          systemIcon="more" 
          selected={this.state.selectedTab === 'more'}
          onPress={() => {
                            this.setTab("more");
                          }}>

          <React.NavigatorIOS
            style={styles.container}
            tintColor='#FF5252'
            initialRoute={{
              title: 'Tùy chọn',
              component: More,
              translucent: true
            }}
            />

        </TabBarIOS.Item>

      </TabBarIOS>
    );
  }
});

//Styling
var styles = React.StyleSheet.create({
  text: {
    color: 'black',
    backgroundColor: 'white',
    fontSize: 30,
    margin: 80
  },
  container: {
    flex: 1
  }
});

//Render the app
React.AppRegistry.registerComponent('Lugagi', function() { return LugagiApp });
