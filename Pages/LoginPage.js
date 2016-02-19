'use strict';
 
var React = require('react-native');
var LugagiHome = require('./LugagiHome.js');
var lugagistyle = require('../Styles/lugagistyle.js');

var {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  ActivityIndicatorIOS,
  Image,
  Component,
  ListView,
  AlertIOS,
  AsyncStorage,
  TouchableOpacity
} = React;

//Styling
var styles = StyleSheet.create({
	appBodyContainer: {
		marginTop: 60,
		flex: 1,
		marginBottom: 50,
	},
  	searchView: {
		alignItems: 'center',
		alignSelf: 'stretch'
	},
	buttonText: {
		fontSize: 18,
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
		marginTop: 20,
		marginLeft: 10,
		marginRight: 10,
		marginBottom: 5,
		flex: 4,
		fontSize: 18,
		borderWidth: 1,
		borderColor: '#48BBEC',
		borderRadius: 3,
	},
	thumb: {
		width: 50,
		height: 50
	},
	listViewContainer: {
		flex: 1,
		padding: 10,
  	},
  	listViewItemContainer: {
  		flex: 1,
    	flexDirection: 'row',
    	padding: 10,
  	},
  	rightContainer: {
  		flex: 1,
  	}
});

//Create class for the page
var LoginPage = React.createClass({
	getInitialState: function() {
		return {
			searchString: '',
			isLoading: false, 
			message: '',
			searchResultDataSource: new ListView.DataSource({
		    	rowHasChanged: (row1, row2) => row1 !== row2,
		  	}),
		  	username: '',
		  	password: '',
		};
	},

	componentDidMount: function() {
		this.getCurrentUser("currentUserID");
		this.getCurrentUser("currentUsername");
		this.getCurrentUser("currentUserProfileImageURL");
		this.getCurrentUser("editPermission");
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
		  	else if (keyName == "editPermission") {
		  		this.setState({
			    	editPermission: value,
			    });
		  	}

		  } else {
		    
		  }
		} catch (error) {
		  //error.message
		}
	},

	//Code to handle change in username and password textbox content
	onUsernameChange: function(event) {
	  this.setState({ username: event.nativeEvent.text });
	},

	onPasswordChange: function(event) {
	  this.setState({ password: event.nativeEvent.text });
	},

	//Code to handle the login button
	loginButtonPress: function() {

		if (this.state.username === "" || this.state.password === "") {
			AlertIOS.alert(
	            'Lỗi',
	            'Vui lòng điền tên đăng nhập và mật khẩu'
            );
		}
		else {
			var loginBody = "loginform=" + "&username=" + this.state.username + "&password=" + this.state.password;
			
			var searchString = this.state.searchString;
			var searchURL = "http://lugagi.com/script/smartPhoneAPI/userdata/loginLogout/login.php";
			
			//Display the loading icon
			this.setState({ isLoading: true });

			fetch(searchURL, {method: "POST", body: loginBody})
	        .then((response) => response.json())
	        .then((responseData) => {
	        	console.log(responseData);
	        	var loginStatus = responseData.LoginStatus.Status;
        		var errorMessage = responseData.LoginStatus.ErrorMessage;
        		var loginUserID = responseData.LoginStatus.CurrentUserID;
        		var loginUsername = responseData.LoginStatus.CurrentUsername;
        		var profileImageURL = responseData.LoginStatus.ProfileImageURL;
        		var editPermission = responseData.LoginStatus.EditPermission;

	        	if (loginStatus == "success") {
	        		AsyncStorage.setItem("currentUserID", loginUserID.toString());
	        		AsyncStorage.setItem("currentUsername", loginUsername.toString());
	        		AsyncStorage.setItem("currentUserProfileImageURL", profileImageURL.toString());
	        		AsyncStorage.setItem("editPermission", editPermission.toString());

	        		this.props.navigator.popToTop();
		        }
		        else if (loginStatus == "failed") {
		        	AlertIOS.alert(
			            'Lỗi',
			            errorMessage
	            	);
		        }
	        })
	        .done(() => {
	        	//Hide the loading icon
	        	this.setState({ isLoading: false });
	        });

    	}
	},

	//Render the page
  	render: function() {
  		//If the user has already logged in
  		if (Number(this.state.currentUserID) > 0) {
	  		return (
		      	<View style={styles.appBodyContainer}>

			        <View style={styles.searchView}>
			        	<Text></Text>
			        	<Text>Bạn đã đăng nhập, vui lòng quay lại</Text>
					</View>

		      </View>
		    );
		}
		//Else, display the login form
	    else {
		    var spinner = this.state.isLoading ?
				( <ActivityIndicatorIOS
				  hidden='true'
				  size='large'/> ) :
				( <View/>);
		    return (
		      	<View style={styles.appBodyContainer}>

			        <View style={styles.searchView}>
			        	<TextInput
			        		ref="usernameTextField"
						    style={lugagistyle.textInput}
						    onChange={this.onUsernameChange}
						    placeholder='Tên đăng nhập'/>

					  	<TextInput
					  		ref="passwordTextField"
						    style={lugagistyle.textInput}
						    secureTextEntry={true}
						    onChange={this.onPasswordChange}
						    placeholder='Mật khẩu'/>
					
						<TouchableOpacity 
							style={lugagistyle.buttonTextAccent}
						    underlayColor='#99d9f4'
						    onPress={this.loginButtonPress}>
						  <Text style={lugagistyle.buttonTextAccent}>Đăng nhập</Text>
						</TouchableOpacity>

						<TouchableOpacity 
							style={lugagistyle.buttonTextAccent}
						    underlayColor='#99d9f4'>
						  <Text style={lugagistyle.buttonTextAccent}>Chưa có tài khoản? Đăng kí ngay!</Text>
						</TouchableOpacity>

						{spinner}
					</View>

		      </View>
		    );
	    }
  	}
});

//Export the class and permit its use in other files
module.exports = LoginPage;