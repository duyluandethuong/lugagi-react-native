'use strict';
 
var React = require('react-native');
var SearchResults = require('./SearchResults');
var FoodDetail = require('./FoodDetail.js');

var lugagistyle = require('../Styles/lugagistyle.js');
var UIImagePickerManager = require('NativeModules').UIImagePickerManager;

var {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  TouchableOpacity,
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
		var searchURL = "http://lugagi.com/script/food/themmonan.php";
		var fetchBody = "";

		fetchBody = fetchBody + "CurrentUserID=" + this.state.currentUserID;
		fetchBody = fetchBody + "&TenMon=" + this.state.newFoodName;
		fetchBody = fetchBody + "&MoTa=" + this.state.newFoodDescription;
		fetchBody = fetchBody + "&LoaiMonAn=" + "2";
		fetchBody = fetchBody + "&foodImageString=" + encodeURIComponent(this.state.foodImageSource.uri); 
		//Must have encodeURIComponent here for the base 64 string to works
		//https://github.com/marcshilling/react-native-image-picker

		//Display the loading icon
		this.setState({ isLoading: true});

		//console.log(this.state.foodImageSource.uri);
		fetch(searchURL, {method: "POST", body: fetchBody})
        .then((response) => response.json())
        .then((responseData) => {
        		console.log(responseData);
        		this.setState({ isLoading: false });

        		var submitStatus = responseData.InsertNewFoodResult[0].Status;

        		if (submitStatus == "success") {
				    this.props.navigator.push({
					  title: 'Món ăn',
					  component: FoodDetail,
					  passProps: {foodID: responseData.InsertNewFoodResult[0].MonAnID}
					});
				}
				else {
					AlertIOS.alert(
			            'Không thể tạo món mới',
			            responseData.InsertNewFoodResult[0].ErrorMessage
		            );
				}
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
					    style={lugagistyle.textInput}
					    value={this.state.searchString}
					    onChange={this.onFoodNameChange}
					    placeholder='Tên món ăn'/>

					<TextInput
					    style={lugagistyle.textInput}
					    value={this.state.searchString}
					    onChange={this.onFoodDescriptionChange}
					    placeholder='Mô tả'/>
					
					<TouchableOpacity
						style={styles.button}
					    underlayColor='#99d9f4'
					    onPress={this.onSelectImageClicked}>
					  <Text style={lugagistyle.buttonTextAccent}>Chọn ảnh cho món ăn</Text>
					</TouchableOpacity>

					{foodImage}

					<TouchableOpacity 
						style={styles.button}
					    underlayColor='#99d9f4'
					    onPress={this.onCreateNewFoodPressed}>
					  <Text style={lugagistyle.buttonTextAccent}>Tạo mới</Text>
					</TouchableOpacity>

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