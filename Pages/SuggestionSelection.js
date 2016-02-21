'use strict';
 
//https://css-tricks.com/snippets/css/a-guide-to-flexbox/

var React = require('react-native');


var {
  StyleSheet,
  Image, 
  View,
  TouchableHighlight,
  TouchableOpacity,
  ListView,
  Text,
  Component,
  ScrollView,
  AsyncStorage,
  AlertIOS
} = React;

var styles = StyleSheet.create({
  appBodyContainer: {
    paddingTop: 44,
    flexDirection: 'column',
    flexWrap: 'wrap',
  },
  ingredientSuggestionView: {
    flex: 1,
  },
  weekMenuSuggestion: {
    flex: 1,
  },
  menuListText: {
    marginTop: 5,
    marginLeft: 10,
    alignSelf: 'center',
  },
  suggestionImage: {
    alignSelf: 'center',
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

var SuggestionSelection = React.createClass({
 
  getInitialState: function() {
    return {
        sessionID: '',
        currentUserID: null,
        currentUsername: null,
        currentUserProfileImageURL: null,
    };
  },

  componentDidMount: function() {
    this.getCurrentUser("currentUserID");
  },

  onIngredientSuggestionPress: function() {
    this.props.navigator.push({
      title: 'Gợi ý nguyên liệu',
      id: 'IngredientSelection',
    });
  },

  onWeekMenuSuggestionPress: function() {
    this.props.navigator.push({
      title: 'Gợi ý cả tuần',
      id: 'WeekMenuSuggestion',
      rightButtonTitle: 'Lưu',
      onRightButtonPress: () => {this.saveCustomMenu()},
    });
  },

  //Async function to get current user
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

  saveCustomMenu: function() {
    //Get the JSON from the temp local storage
    var customMenuID = "";
    AsyncStorage.getItem("tempSuggestionJSON").then((existingData) => {
      console.log("Save to server JSON:");
      console.log(existingData);
      var searchURL = "http://lugagi.com/script/smartPhoneAPI/suggestion/weekMenuSuggestion/saveMenuSuggestion.php";
      var fetchBody = "TempSuggestionJSON=" + existingData + "&CurrentUserID=" + this.state.currentUserID;
      
      fetch(searchURL, {method: "POST", body: fetchBody})
      .then((response) => response.json())
      .then((responseData) => {
          console.log(responseData);

          var status = responseData.CreateCustomMenu.Status;
          var message = responseData.CreateCustomMenu.Message;

          var statusText = "";
          if (status == true) {
            customMenuID = responseData.CreateCustomMenu.CustomMenuID;
            statusText = "Thành công";
          }
          else {
            statusText = "Lỗi";
          }

          AlertIOS.alert(
            statusText,
            message,
            [
              {text: 'Xong', onPress: () => console.log('Xong!')},
            ]
          )
      })
      .done(() => {
        //Direct the user to the page with loaded by the menu ID
        // this.props.navigator.push({
        //   title: 'Gợi ý',
        //   component: WeekMenuSuggestion,
        //   passProps: {menuID: customMenuID}
        // });
      });
    });

  },

  render: function() {

    //Final render for the whole list of options on this page
    return (
      <ScrollView style={styles.appBodyContainer}>

        <TouchableOpacity underlayColor='#99d9f4' 
                          style={styles.ingredientSuggestionView}
                          onPress={this.onIngredientSuggestionPress}
                          suggestionType='ingredient'>
          <View>
            <Image source={require('../Images/ingredientSuggestion.png')}
                style={styles.suggestionImage}/>
            <Text style={styles.menuListText}>Gợi ý bằng nguyên liệu</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity underlayColor='#99d9f4' 
                          style={styles.weekMenuSuggestion}
                          onPress={this.onWeekMenuSuggestionPress}>
          <View>
            <Image source={require('../Images/weekMenuSuggestion.png')}
                style={styles.suggestionImage}/>
            <Text style={styles.menuListText}>Gợi ý thực đơn tuần</Text>
          </View>
        </TouchableOpacity>

      </ScrollView>
    );
  }
 
});

module.exports = SuggestionSelection;