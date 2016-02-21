'use strict';
 
var React = require('react-native');
var SearchResults = require('./SearchResults');
var FoodDetail = require('./FoodDetail.js');
var LoginPage = require('./LoginPage.js');

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
  Alert,
  AsyncStorage,
  Image,
  Component,
  ListView,
  ScrollView,
  PickerIOS,
  Picker,
  NativeModules: {
    UIImagePickerManager
  }
} = React;

var PickerItem = Picker.Item;

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
			newFoodType: 0,
			newFoodTypeText: '',
			foodImageSource: '',
			showFoodImage: false,
			foodTypeArray: [],
			showFoodTypeSelector: false,
			showHideFoodTypePickerButtonText: "Chọn cách chế biến",
		};
	},

	componentWillMount: function() {
		this.getCurrentUser();

		//Get the food type from server
		var getFoodTypeURL = "http://lugagi.com/script/food/getFoodType.php";
		fetch(getFoodTypeURL, {method: "GET"})
        .then((response) => response.json())
        .then((responseData) => {
        	var allFoodTypeObject = [];

        	for (var i in responseData.FoodTypes) {
        		var foodTypeID = responseData.FoodTypes[i].LoaiMonAnID;
        		var foodTypeName = responseData.FoodTypes[i].LoaiMonAnDescription;
        		var foodTypeObject = {name: foodTypeName, value: foodTypeID};
        		allFoodTypeObject.push(foodTypeObject);
        	}

        	this.setState({ 
    			foodTypeArray: allFoodTypeObject 
    		});
        })
        .done(() => {
        });
	},

	componentDidMount: function() {

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

	    UIImagePickerManager.showImagePicker(options, (response) => {

	    	console.log('Response = ', response);

			if (response.didCancel) {
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

		//First do the validation
		var bValidationPass = false;
		var missingInfo = "Bạn chưa nhập các thông tin sau:";

		//Initially check for the login user
		if (this.state.currentUserID) {
			if (this.state.newFoodName == "") {
				bValidationPass = false;
				missingInfo = missingInfo + "\nTên món ăn";
			}
			else {
				bValidationPass = true;
			}

			if (this.state.newFoodType <= 0) {
				bValidationPass = false;
				missingInfo = missingInfo + "\nCách chế biến";
			}
			else {
				bValidationPass = true;
			}
			
			//If all validation passed, then we can continue to add the food
			if (bValidationPass == true) {
				var searchString = this.state.searchString;
				var searchURL = "http://lugagi.com/script/food/themmonan.php";
				var fetchBody = "";

				fetchBody = fetchBody + "CurrentUserID=" + this.state.currentUserID;
				fetchBody = fetchBody + "&TenMon=" + this.state.newFoodName;
				fetchBody = fetchBody + "&MoTa=" + this.state.newFoodDescription;
				fetchBody = fetchBody + "&LoaiMonAn=" + this.state.newFoodType;
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
							  id: 'FoodDetail',
							  passProps: {foodID: responseData.InsertNewFoodResult[0].MonAnID}
							});
						}
						else {
							Alert.alert(
					            'Không thể tạo món mới',
					            responseData.InsertNewFoodResult[0].ErrorMessage
				            );
						}
		        })
		        .done(() => {
		        	//Hide the loading icon
		        	
		        });
	    	}
	    	else {
	    		Alert.alert('Thiếu thông tin', missingInfo);
	    	}
    	}
    	else {
	    	//If the user has not logged in yet, direct him to the login page
	    	Alert.alert(
			  'Chưa đăng nhập',
			  'Bạn cần phải đăng nhập trước khi tạo món mới',
			  [
			    {text: 'Hủy', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
			    {text: 'Đăng nhập', onPress: () => this.props.navigator.push({
													  title: 'Đăng nhập',
													  component: LoginPage,
													})
				},
			  ]
			);
    	}
	},

	showHideFoodTypePicker: function () {
		if (this.state.showFoodTypeSelector == true) {
			this.setState({showFoodTypeSelector: false, showHideFoodTypePickerButtonText: "Đổi cách chế biến"});
		}
		else {
			this.setState({showFoodTypeSelector: true, showHideFoodTypePickerButtonText: "Chấp nhận"});
		}
	},

	onFoodTypePickerChange: function(selectedFoodType) {
		console.log(selectedFoodType);

		for (var i=0; i < this.state.foodTypeArray.length; i++) {
			if (this.state.foodTypeArray[i].value == selectedFoodType) {
				var selectedFoodTypeText = this.state.foodTypeArray[i].name;
				break; //If match, then end the loop immediately
			}
			else {
				var selectedFoodTypeText = "Không xác định";
			}
		}

		this.setState({
			newFoodType: selectedFoodType,
			newFoodTypeText: selectedFoodTypeText,
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

		var foodTypePicker = this.state.showFoodTypeSelector ?
			(	<Picker
					style={lugagistyle.picker}
					selectedValue={this.state.newFoodType}
					onValueChange={(selectedFoodType) => this.onFoodTypePickerChange(selectedFoodType)}>
					{Object.keys(this.state.foodTypeArray).map((selectedFoodType) => (
						<PickerItem
							key={this.state.foodTypeArray[selectedFoodType].value}
							value={this.state.foodTypeArray[selectedFoodType].value}
							label={this.state.foodTypeArray[selectedFoodType].name}
						/>
					))}
		        </Picker>):
			(<View/>);

		if (this.state.showFoodImage == true) {
			var foodImage = (<Image source={this.state.foodImageSource} style={styles.thumb} />);
		}
		else {
			var foodImage = (<View/>);
		}

		return (
	      	<ScrollView style={[lugagistyle.appBodyContainer, lugagistyle.formBackground]}>

		        <View style={lugagistyle.form}>
		        	<Text style={[lugagistyle.formLabel]}>Tên món ăn</Text>
		        	<View style={lugagistyle.formControl}>
					  	<TextInput
						    style={lugagistyle.formInput}
						    value={this.state.searchString}
						    onChange={this.onFoodNameChange}
						    placeholder='Ví dụ: Cá lóc kho tộ'/>
					</View>

					<Text style={[lugagistyle.formLabel]}>Mô tả</Text>
					<View style={lugagistyle.formControl}>
						<TextInput
						    style={lugagistyle.formTextArea}
						    value={this.state.searchString}
						    onChange={this.onFoodDescriptionChange}
						    multiline={true}
						    numberOfLines={5}
						    placeholder='Ví dụ: Cá lóc kho tộ là món ngon của miền Nam, rất đơn giản nhưng rất đậm đà'/>
					</View>

					<Text style={[lugagistyle.formLabel]}>Cách chế biến</Text>
					<View style={lugagistyle.formControl}>
						<Text style={lugagistyle.buttonTextNormal}>{this.state.newFoodTypeText}</Text>
						<TouchableOpacity
						    onPress={this.showHideFoodTypePicker}>
						  <Text style={lugagistyle.buttonTextAccent}>{this.state.showHideFoodTypePickerButtonText}</Text>
						</TouchableOpacity>
					</View>

					{foodTypePicker}

					<Text style={[lugagistyle.formLabel]}>Hình ảnh</Text>
					<View style={lugagistyle.formControl}>
						<TouchableOpacity
						    onPress={this.onSelectImageClicked}>
						  <Text style={lugagistyle.buttonTextAccent}>Bấm để chọn ảnh cho món ăn</Text>
						</TouchableOpacity>

						{foodImage}

						{spinner}
					</View>

					<Text style={[lugagistyle.formLabel]}>Hoàn tất</Text>
					<View style={lugagistyle.formControl}>
						<TouchableOpacity 
							style={[lugagistyle.buttonAccent]}
						    onPress={this.onCreateNewFoodPressed}>
						  <Text style={lugagistyle.buttonTextAccent}>TẠO</Text>
						</TouchableOpacity>
					</View>

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
		
	},
	thumb: {
		width: 300,
		height: 200,
		alignSelf: 'center',
		marginBottom: 10,
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