'use strict';
var React = require('react-native');
var FoodDetail = require('./FoodDetail.js');
var Switcher = require('react-native-switcher');

var {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  TouchableOpacity,
  ActivityIndicatorIOS,
  AsyncStorage,
  Image,
  Component,
  ListView,
  ScrollView,
  AlertIOS
} = React;

//Create class for the page
var FoodCard = React.createClass({
	getInitialState: function() {
	    return {
	    	menuID: this.props.menuID,
	        food: this.props.food,
	        day: this.props.day,
	        meal: this.props.meal,
	        mealOrder: this.props.mealOrder,
	        navigator: this.props.navigator,
	        onPress: React.PropTypes.func,
	        isVisible: 'true',
	    };
	},

	componentDidMount: function() {
		
	},

	//Navigate to the food page
	goToFood: function(contentID, contentType) {
		console.log("Pressed on content Number: " + contentID);
		if (contentType == "food" || contentType == "") {
			this.props.navigator.push({
			  title: 'Món ăn',
			  component: FoodDetail,
			  passProps: {foodID: contentID},
			});
		}
	},

	updateSuggestionData: function(action) {
		var editMenuSuggestionURL = "http://lugagi.com/script/smartPhoneAPI/suggestion/weekMenuSuggestion/editMenuSuggestion.php";

		//Menu ID
		var menuID = this.state.menuID;

		//Random
		var isRandom = "Y";

		//Construct food information
		var day = this.state.day;
	    var meal = this.state.meal;
	    var mealOrder = this.state.mealOrder;
	    var menuAction = action;

	    //Get the JSON from the temp local storage
    	AsyncStorage.getItem("tempSuggestionJSON").then((existingData) => {
		    //Put them all in a final body to be sent
		    var dataString = "TempSuggestionJSON=" + existingData;
		    dataString = "&CustomMenuID=" + menuID;
		    dataString = dataString + "&Day=" + day;
		    dataString = dataString + "&Meal=" + meal;
		    dataString = dataString + "&MealOrder=" + mealOrder;
		    dataString = dataString + "&IsRandom=" + isRandom;
		    dataString = dataString + "&Action=" + menuAction;

			//Display the loading icon
			this.setState({ isLoading: true });

			fetch(editMenuSuggestionURL, {method: "POST", body: dataString})
		    .then((response) => response.json())
		    .then((responseData) => {

		        console.log("Respond data:");
		        console.log(responseData);

		        //Determine whether to show or hide the food card
				if (action == "edit") {
					this.setState({ 
			        	isVisible: "true",
			        	//Change the state of the child to update the food card
			        	food: responseData[day]['Meal'][meal][mealOrder],
		            });
				}
				else if (action == "remove") {
					this.setState({ 
			        	isVisible: "false",
		            });
				}

				//Modify the existing JSON string in the storage
				var newJSONstring = JSON.parse(existingData);
				newJSONstring[day]['Meal'][meal][mealOrder] = responseData[day]['Meal'][meal][mealOrder];
				console.log("new JSON string");
				console.log(newJSONstring);
				AsyncStorage.setItem("tempSuggestionJSON", JSON.stringify(newJSONstring));

		    })
		    .catch((error) => {
			    console.warn(error);
			})
		    .done(() => {
		    });
		});

	},

	render: function() {
		if (this.state.isVisible == "true") {
			var monAnID = this.state.food.MonAnID;
			var monAnName = this.state.food.MonAnName;
			var monAnAnMotMon = this.state.food.AnMotMon;
			var monAnImageURL = this.state.food.ImageURL;
			//Process image URL
			if (monAnImageURL) {
				monAnImageURL = "http://lugagi.com/script/timthumb.php?src=/foodimages/" + monAnImageURL + "&w=120&h=150"; 
			}
			else {
				monAnImageURL = "http://lugagi.com/script/timthumb.php?src=/foodimages/hinh_thay_the_Duy_Luan.jpg&w=120&h=150";
			}

			return(
				<TouchableOpacity onPress={() => this.goToFood(monAnID, "food")}>
					<View style={styles.foodCard}>
						<Image source={{uri: monAnImageURL}} style={styles.foodImage}/>
				    	<Text style={styles.foodName} numberOfLines={1}>{monAnName}</Text>
				    	<TouchableOpacity>
				    		<Text style={styles.buttonText} onPress={() => this.updateSuggestionData("edit")}>Đổi món</Text>
				    	</TouchableOpacity>
				    	<TouchableOpacity>
				    		<Text style={styles.buttonText} onPress={() => this.updateSuggestionData("remove")}>Xóa món</Text>
				    	</TouchableOpacity>
					</View>
				</TouchableOpacity>
			);
		}
		else {
			return(<View />);
		}
	},
});


//Create class for the page
var WeekMenuSuggestion = React.createClass({
	getInitialState: function() {
	    return {
	        isLoading: false,
	        searchString: '',
		  	suggestionData: new Object(),
		  	sessionID: '',
		  	menuID: this.props.menuID,
	    };
	},

	changeHandler: function(value) {

    },

	//Code to handle the find button
	componentDidMount: function() {
		this.getSuggestionData();
	},

	//Code to handle change in search textbox content
	onSearchTextChanged: function(event) {
	  this.setState({ searchString: event.nativeEvent.text });
	},

	getSuggestionData: function() {

		//If there is no menu ID passed to the scene, then run a new suggestion
		var searchURL = "";
		var fetchBody = "";

		if (!this.state.menuID) {
			searchURL = "http://lugagi.com/script/smartPhoneAPI/suggestion/weekMenuSuggestion/runMenuSuggestion.php";
			fetchBody = "";
		}
		//If there is menu ID, then load that JSON file from server
		else {
			console.log("MenuID: " + this.state.menuID);
			searchURL = "http://lugagi.com/script/smartPhoneAPI/suggestion/weekMenuSuggestion/getMenuSuggestion.php";
			fetchBody = "GetMode=load" + "&CustomMenuID=" + this.state.menuID;
		}

		//Display the loading icon
		this.setState({ isLoading: true });

		fetch(searchURL, {method: "POST", body: fetchBody})
	    .then((response) => response.json())
	    .then((responseData) => {
	      	this.setState({
	      		suggestionData: responseData,
	      		sessionID: responseData.SessionID,
	    	});
	    	//Save JSON to local storage
	        AsyncStorage.setItem("tempSuggestionJSON", JSON.stringify(responseData)); //Không save????
	    })
	    .done(() => {
			//Hide the loading icon
			this.setState({ isLoading: false });
	    });
	},


	//Navigate to the food page
	contentItemPresses: function(contentID, contentType) {
		console.log("Pressed on content Number: " + contentID);
		if (contentType == "food" || contentType == "") {
			this.props.navigator.push({
			  title: 'Món ăn',
			  component: FoodDetail,
			  passProps: {foodID: contentID}
			});
		}
	},

	//Render the page
  	render: function() {
  		var spinner = this.state.isLoading ?
			( <ActivityIndicatorIOS
			  hidden='true'
			  size='large'/> ) :
			( <View/>);

  		//Render the page
  		var data = this.state.suggestionData;
		var PageContent = [];

  		//Process the suggestion data
  		for (var i in data) {
  			var tenThu = "";

  			if (i == 0) {
				tenThu = "Thứ hai";
			}
			else if (i == 1) {
				tenThu = "Thứ ba";
			}
			else if (i == 2) {
				tenThu = "Thứ 4";
			}
			else if (i == 3) {
				tenThu = "Thứ 5";
			}
			else if (i == 4) {
				tenThu = "Thứ 6";
			}
			else if (i == 5) {
				tenThu = "Thứ 7";
			}
			else if (i == 6) {
				tenThu = "Chủ nhật";
			}

            var ngayThu = data[i].Day;
            var hiddenData = "";
            var dayMeal = data[i].Meal;

            var DayRow = [];

            //Loop through 3 meals in a day
            for (var j in dayMeal) {
              
				var buoiAn = dayMeal[j].MealOrder;
				var mealDescription = "";
				var newMealRow = [];

				if (buoiAn == 0) {
					mealDescription = "Buổi sáng";
				}
				else if (buoiAn == 1) {
					mealDescription = "Buổi trưa";
				}
				else if (buoiAn == 2) {
					mealDescription = "Buổi tối";
				}

              	//Loop and display all the foods in each meal
	          	for (var k in dayMeal[j]) {
	                var food = dayMeal[j][k];

	                if (food.MonAnName) {
						var monAnID = food.MonAnID;

						//Create a new card for the food
						//We must pass the navigator to the child component so we can navigate from it
						var newFoodCard = (
							<FoodCard 	food={food} day={i} meal={j} mealOrder={k} monAnID={monAnID} 
										navigator={this.props.navigator}
										sessionID={this.state.sessionID}
										menuID={this.state.menuID}
										onPress={this.changeHandler}
										currentSuggestionData = {this.state.responseData}/>
						);
						
						//Push the card to the meal array
						newMealRow.push(newFoodCard);
	            	}
	          	}

	          	//Render the meal row for each of the meal, and push to the day array
	          	var newMealRowFinal = (
					<View>
						<Text style={styles.mealTitleText}>{mealDescription}</Text>
						<View style={styles.mealRow}>
							{newMealRow}
						</View>
					</View>
				);
	          	DayRow.push(newMealRowFinal);
	        }

	        //Render the View for each of the page in the switcher
	        var dayMealRowFinal = (
				<ScrollView style={styles.pageContainer}>
					<Text style={styles.dayTitle}>{tenThu}</Text>
					{DayRow}
				</ScrollView>
			);
	        PageContent.push(dayMealRowFinal);
        }

  		//Render the scene
  		
	    return (
	      	<Switcher style={styles.appBodyContainer}>
		        {PageContent}
		    </Switcher>
	    );
  	},

});

//Styling
var styles = StyleSheet.create({
	appBodyContainer: {

	},
	pageContainer: {
		flex: 1,
		marginTop: 80,
		marginBottom: 50,
		paddingLeft: 10,
	},
	introduction: {
		marginLeft: 20,
		marginRight: 20,
	},
	buttonText: {
		color: '#48BBEC',
		alignSelf: 'center'
	},
	button: {
		height: 36,
		flex: 1,
		borderRadius: 5,
		marginBottom: 10,
		alignSelf: 'stretch',
		justifyContent: 'center'
	},
	searchInput: {
		height: 36,
		padding: 4,
		margin: 20,
		fontSize: 16,
		borderWidth: 1,
		borderColor: '#48BBEC',
		borderRadius: 3,
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
	},
	dayTitle: {
		color: '#48BBEC',
		fontWeight: 'bold',
		fontSize: 18,
		alignSelf: 'center'
	},
	mealRow: {
		flex: 1,
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	mealTitleText: {
		color: '#48BBEC',
		fontSize: 16,
		fontWeight: 'bold',
		marginTop: 10,
		marginBottom: 5,
	},
	foodName: {
		marginBottom: 5,
	},
	foodImage: {
		width: 120,
		height: 100,
		marginRight: 10
	},
	foodCard: {
		width: 120,
		height: 180,
		marginLeft: 10,
	}
});

//Export the class and permit its use in other files
module.exports = WeekMenuSuggestion;