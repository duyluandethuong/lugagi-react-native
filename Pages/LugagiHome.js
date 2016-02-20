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
  AsyncStorage
} = React;

//Styling
var styles = StyleSheet.create({
	appBodyContainer: {
		flex: 1,
	},
  	randomFoodContainer: {
		flex: 1,
  	},
  	listViewContainer: {
  		marginTop: 0,
  		marginBottom: 5,
		flex: 1,
		height: 150,
  	},
  	listViewItemContainer: {
  		marginRight: 5,
	    padding: 5,
	    alignItems: 'center',
	    flex: 1,
    	width: 150,
	    height: 150,
	    backgroundColor: '#F6F6F6',
  	},
  	rightContainer: {
	    flex: 1,
	},
	image: {
		width: 500,
		height: 150,
		justifyContent: 'center',
		alignSelf: 'stretch',
	},
	thumb: {
		width: 150,
		height: 100
	},
	roundThumb: {
		height: 100,
		width: 100,
		borderRadius: 50,
	},
	sectionTitle: {
		color: '#48BBEC',
		fontSize: 18,
		marginTop: 5,
		marginBottom: 10,
		marginLeft: 5,
	},
	randomFoodName: {
		fontWeight: 'bold',
		fontSize: 17,
		marginTop: 10,
		textAlign: 'center'
	},
	contentName: {
		marginTop: 5,
	}
});

var LugagiHome = React.createClass({
	getInitialState: function() {
		return {
			currentUserID: null,
			currentUsername: null,
			currentUserProfileImageURL: null,
		  	editorPickedSource: new ListView.DataSource({
		    	rowHasChanged: (row1, row2) => row1 !== row2,
		  	}),
		  	latestFoodSource: new ListView.DataSource({
		    	rowHasChanged: (row1, row2) => row1 !== row2,
		  	}),
            userInterestedFoodSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            newUsersInfoSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
		  	loaded: false,
		  	randomFoodID: '',
		  	randomFoodName: '',
			randomFoodImageURL: '',
		};
	},

	componentDidMount: function() {
		this.getRandomFood();
		this.getEditorPickedContent();
		this.getLatestFood();
		this.getNewUsersInfo();
		this.getCurrentUser("currentUserID");
		this.getCurrentUser("currentUsername");
		this.getCurrentUser("currentUserProfileImageURL");
		this.getUserInterestedFood();
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

	//https://blog.nraboy.com/2015/09/make-http-requests-in-ios-with-react-native/
	getRandomFood: function() {
        fetch("http://lugagi.com/script/food/generateRandomFood.php", {method: "GET"})
        .then((response) => response.json())
        .then((responseData) => {
        	for (var i in responseData.Foods) {
        		var monAnID = responseData.Foods[i].MonAnID;
        		var monAnName = responseData.Foods[i].MonAnName;
        		var imageURL = responseData.Foods[i].ImageURL;
        		var fullImageURL = "http://lugagi.com/script/timthumb.php?src=/foodimages/" + imageURL + "&w=500&h=200";
        	}
            this.setState({ randomFoodID: monAnID,
            				randomFoodName: monAnName,
            				randomFoodImageURL: fullImageURL,
            				isLoading: true
            });
        })
        .done(() => {
        	this.setState({ isLoading: false });
        });
	},

	getEditorPickedContent: function() {
		fetch("http://lugagi.com/script/smartPhoneAPI/landing/loadEditorPickedContent.php", {method: "GET"})
        .then((response) => response.json())
        .then((responseData) => {
        	this.setState({
		      editorPickedSource: this.state.editorPickedSource.cloneWithRows(responseData.EditorPickContents),
		      loaded: true,
		    });
        })
        .done();
	},

	getLatestFood: function() {
		fetch("http://lugagi.com/script/smartPhoneAPI/landing/loadLatestFood.php", {method: "GET"})
        .then((response) => response.json())
        .then((responseData) => {
        	this.setState({
		      latestFoodSource: this.state.latestFoodSource.cloneWithRows(responseData.LatestFood),
		      loaded: true,
		    });
        })
        .done();
	},

	getUserInterestedFood: function(){

		var fetchParam = "?UserID=" + this.state.currentUserID + "&Limit=12";
		fetch("http://lugagi.com/script/smartPhoneAPI/landing/loadUserInterestedFood.php" + fetchParam, {method: "GET"})
        .then((response) => response.json())
        .then((responseData) => {
        	this.setState({
		      userInterestedFoodSource: this.state.userInterestedFoodSource.cloneWithRows(responseData.InterestedFoods),
		      loaded: true,
		    });
        })
        .done();
	},

	getNewUsersInfo: function(){
		var fetchParam = "?Limit=12";
		fetch("http://lugagi.com/script/smartPhoneAPI/landing/loadNewUsers.php" + fetchParam, {method: "GET"})
        .then((response) => response.json())
        .then((responseData) => {
        	this.setState({
		      newUsersInfoSource: this.state.newUsersInfoSource.cloneWithRows(responseData.NewUsers),
		      loaded: true,
		    });
        })
        .done();
	},

	renderContentList: function(content) {
		var fullImageURL = "http://lugagi.com/script/timthumb.php?src=/" + content.ContentImageURL + "&w=300&h=200";
		return (
			<TouchableHighlight underlayColor='rgba(0,0,0,0)' 
				onPress={() => this.contentItemPresses(content.ContentID, content.ContentType)}>
                <View style={styles.listViewItemContainer}>
					<Image
					  source={{uri: fullImageURL}}
					  style={styles.thumb}/>
					<Text style={styles.contentName} numberOfLines={2}>{content.ContentName}</Text>
				</View>
			</TouchableHighlight>
		);
	},
	renderUserList: function(userInfo) {
		return (
			<TouchableHighlight underlayColor='rgba(0,0,0,0)' 
				>
                <View style={styles.listViewItemContainer}>
					<Image
					  source={{uri: userInfo.UserImageURL}}
					  style={styles.roundThumb}/>
					<Text style={styles.contentName} numberOfLines={2}>{userInfo.UserName}</Text>
				</View>
			</TouchableHighlight>
		);	
	},

	contentItemPresses: function(contentID, contentType) {
		if (contentType == "food" || contentType == "") {
			this.props.navigator.push({
			  title: 'Món ăn',
			  component: FoodDetail,
			  passProps: {foodID: contentID}
			});
		}
	},

	goesToRandomFood: function() {
		this.props.navigator.push({
		  title: 'Món ăn',
		  component: FoodDetail,
		  passProps: {foodID: this.state.randomFoodID}
		});
	},

	render: function() {
		return (
			<ScrollView style={styles.appBodyContainer}>
				<View style={styles.randomFoodContainer}>
					<View>
						<Text style={[lugagistyle.textPrimary, lugagistyle.sectionTitle]}>Nấu gì hôm nay?</Text>
					</View>

					<TouchableHighlight onPress={this.goesToRandomFood}>
						<View>
							<Image
								source={{uri: this.state.randomFoodImageURL}}
								style={styles.image}/>
							<Text style={styles.randomFoodName}>{this.state.randomFoodName}</Text>
						</View>
					</TouchableHighlight>

					<TouchableOpacity style={lugagistyle.buttonAccent}
					    underlayColor={lugagistyle.buttonAccentUnderlay}
					    onPress={this.getRandomFood} >
						<Text style={lugagistyle.buttonTextAccent}>Đổi món khác</Text>
					</TouchableOpacity>
				</View>

				<Text style={[lugagistyle.textPrimary, lugagistyle.sectionTitle]}>Chọn bởi Lugagi</Text>
				<ListView
				    dataSource={this.state.editorPickedSource}
				    renderRow={this.renderContentList}
				    style={styles.listViewContainer}
				    horizontal={true}/>

				<Text style={[lugagistyle.textPrimary, lugagistyle.sectionTitle]}>Món ăn mới nhất</Text>
				<ListView
				    dataSource={this.state.latestFoodSource}
				    renderRow={this.renderContentList}
				    style={styles.listViewContainer}
				    contentContainerStyle={styles.list}
				    horizontal={true}/>

				<Text style={[lugagistyle.textPrimary, lugagistyle.sectionTitle]}>Có thể bạn thích</Text>
				<ListView
				    dataSource={this.state.userInterestedFoodSource}
				    renderRow={this.renderContentList}
				    style={styles.listViewContainer}
				    horizontal={true}/>

				<Text style={[lugagistyle.textPrimary, lugagistyle.sectionTitle]}>Người dùng mới</Text>
				<ListView
				    dataSource={this.state.newUsersInfoSource}
				    renderRow={this.renderUserList}
				    style={styles.listViewContainer}
				    horizontal={true}/>

			</ScrollView>
		);
	},

});

//Export the class and permit its use in other files
module.exports = LugagiHome;