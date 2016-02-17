'use strict';
 
var React = require('react-native');
var SearchResults = require('./SearchResults');

var {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  ActivityIndicatorIOS,
  AlertIOS,
  AsyncStorage,
  Image,
  Component,
  ListView,
  ScrollView,
  NativeModules: {
    UIImagePickerManager
  }
} = React;

var UIImagePickerManager = require('NativeModules').UIImagePickerManager;

//Create class for the page
var AddNewFood =  React.createClass({
	getInitialState: function() {
		return {
			currentUserID: null,
			currentUsername: null,
			currentUserProfileImageURL: null,
		  	isLoading: false,
		  	newFoodName: '',
		  	newFoodDescription: '',
			newFoodType: '',
			foodImageSource: '',
			showFoodImage: false,
		};
	},

	componentWillMount: function() {
		this.getCurrentUser();
	},

	getCurrentUser: function() {
		AsyncStorage.getItem("currentUserID").then((existingData) => {
    		this.setState({ 
    			currentUserID: existingData 
    		});
    	});
	},

	/********** Code to handle change in textbox content *****************/
	onFoodNameChange: function(event) {
	  this.setState({ newFoodName: event.nativeEvent.text });
	},

	onFoodDescriptionChange: function(event) {
	  this.setState({ newFoodDescription: event.nativeEvent.text });
	},

	onFoodTypeChange: function(event) {
	  
	},

	onSelectImageClicked: function() {
		//https://github.com/marcshilling/react-native-image-picker
		this.setState({ isLoading: true });

        const options = {
	      	title: "Chọn ảnh cho món ăn",
	      	cancelButtonTitle: 'Hủy',
  			takePhotoButtonTitle: 'Chụp ảnh mới...',
  			chooseFromLibraryButtonTitle: 'Chọn từ ảnh có sẵn...',
  			maxWidth: 960,
  			maxHeight: 960,
	      	quality: 0.8,
	      	noData: false,
	      	storageOptions: {
	        	skipBackup: true
	      	}
	    };

	    UIImagePickerManager.showImagePicker(options, (didCancel, response) => {

	      if (didCancel) {
	        console.log('User cancelled image picker');
	      }
	      else {
	        if (response.customButton) {
	          console.log('User tapped custom button: ', response.customButton);
	        }
	        else {
	          // You can display the image using either:
	         	const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
	          	//const source = {uri: response.uri.replace('file://', ''), isStatic: true};
				this.setState({
					foodImageSource: source,
					showFoodImage: true,
					isLoading: false,
				});
	        }
	      }
	    });
	},
	/********** End of food content recording *****************/

	//Code to handle the find button
	onCreateNewFoodPressed: function() {
		var searchString = this.state.searchString;
		var searchURL = "http://lugagi.com/script/smartPhoneAPI/food/themmonan.php";
		var fetchBody = "";

		fetchBody = fetchBody + "CurrentUserID=" + this.state.currentUserID;
		fetchBody = fetchBody + "&TenMon=" + this.state.newFoodName;
		fetchBody = fetchBody + "&MoTa=" + this.state.newFoodDescription;
		fetchBody = fetchBody + "&LoaiMonAn=" + "2";
		fetchBody = fetchBody + "&foodImageString=" + this.state.foodImageSource.uri;

		//Display the loading icon
		this.setState({ isLoading: true});

		//console.log(this.state.foodImageSource.uri);
		fetch(searchURL, {method: "POST", body: fetchBody})
        .then((response) => response.json())
        .then((responseData) => {
        		console.log(responseData);
        		this.setState({ isLoading: false });
		 //    this.props.navigator.push({
			//   title: 'Kết quả',
			//   component: SearchResults,
			//   passProps: {searchResultDataSource: responseData.FoodSearchReults}
			// });
        })
        .done(() => {
        	//Hide the loading icon
        	
        });
	},

	//Render the page
  	render: function() {
  		var spinner = this.state.isLoading ?
			( <View>
					<ActivityIndicatorIOS
					  hidden='true'
					  size='large'
					  style={styles.loadingIcon}/> 
					<Text>Đang xử lý...</Text>
			  </View>) :
			( <View/>);

		if (this.state.showFoodImage == true) {
			var foodImage = (<Image source={this.state.foodImageSource} style={styles.thumb} />);
		}
		else {
			var foodImage = (<View/>);
		}

		return (
	      	<ScrollView style={styles.appBodyContainer}>

		        <View style={styles.searchView}>
				  	<TextInput
					    style={styles.searchInput}
					    value={this.state.searchString}
					    onChange={this.onFoodNameChange}
					    placeholder='Tên món ăn'/>

					<TextInput
					    style={styles.searchInput}
					    value={this.state.searchString}
					    onChange={this.onFoodDescriptionChange}
					    placeholder='Mô tả'/>
					
					<TouchableHighlight 
						style={styles.button}
					    underlayColor='#99d9f4'
					    onPress={this.onSelectImageClicked}>
					  <Text style={styles.buttonText}>Chọn ảnh cho món ăn</Text>
					</TouchableHighlight>

					{foodImage}

					<TouchableHighlight 
						style={styles.button}
					    underlayColor='#99d9f4'
					    onPress={this.onCreateNewFoodPressed}>
					  <Text style={styles.buttonText}>Tạo mới</Text>
					</TouchableHighlight>

					{spinner}
				</View>

	      	</ScrollView>
	    );
  	}
});


//Styling
var styles = StyleSheet.create({
	appBodyContainer: {
		flex: 1,
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
		marginLeft: 20,
		marginRight: 20,
		marginTop: 10,
		flex: 4,
		fontSize: 16,
		borderWidth: 1,
		borderColor: '#48BBEC',
		borderRadius: 3,
		color: '#48BBEC'
	},
	thumb: {
		width: 300,
		height: 200,
		alignSelf: 'center'
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
  	},
  	loadingIcon: {
  		alignSelf: 'center',
  	}
});

//Export the class and permit its use in other files
module.exports = AddNewFood;