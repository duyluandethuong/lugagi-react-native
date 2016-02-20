'use strict';
 
//var Swiper = require('react-native-swiper');
var React = require('react-native');
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
  Image,
  Component,
  Alert,
  ListView,
  ScrollView,
  Picker,
  AsyncStorage,
  NativeModules: {
    UIImagePickerManager
  }
} = React;

var PickerItem = Picker.Item;

//Styling
var styles = StyleSheet.create({
	thumb: {
		width: 300,
		height: 200,
		alignSelf: 'center',
		marginBottom: 10,
	},
});

var EditFoodDetail = React.createClass({
	getInitialState: function() {
		return {
			foodID: this.props.foodID,
			foodObject: new Object(),
			foodType: new Object(),
		  	isLoading: true,
		  	currentUserID: 0,
		  	currentUsername: 0,
		  	currentUserProfileImageURL: '',
		  	editPermission: 'N',
		  	foodTypeArray: [],
		  	showFoodTypeSelector: false,
		  	showHideFoodTypePickerButtonText: "Đổi cách chế biến",
		  	foodImageSource: '',
			showFoodImage: false,
			showCurrentFoodImage: true,
		};
	},

	componentWillMount: function() {
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
		this.getFoodInformation();
		this.getCurrentUser();
	},

	//https://blog.nraboy.com/2015/09/make-http-requests-in-ios-with-react-native/
	getFoodInformation: function() {
		var fetchBody = "MonAnID=" + this.state.foodID;

        fetch("http://lugagi.com/script/smartPhoneAPI/food/getFoodInfo.php", 
        		{	method: "POST",
        			body: fetchBody})
        .then((response) => response.json())
        .then((responseData) => {
        	this.setState({
        		foodObject: responseData.FoodInfo[0],
        		foodType: responseData.FoodInfo[0].LoaiMonAn[0],
        	});

        	//Set the image for the current food
        	var foodImageSource = "http://lugagi.com/script/timthumb.php?src=" + this.state.foodObject.ImageURL + "&w=500&h=200&q=50";
        	
        	this.setState({
        		foodImageSource: foodImageSource,
        		showCurrentFoodImage: true
        	});
        })
        .done(() => {
        	this.setState({
        		isLoading: false,
        	});
        });
	},

	getCurrentUser: function() {
		AsyncStorage.getItem("currentUserID").then((existingData) => {
    		this.setState({ 
    			currentUserID: existingData 
    		});
    	});
    	AsyncStorage.getItem("currentUsername").then((existingData) => {
    		this.setState({ 
    			currentUsername: existingData 
    		});
    	});
    	AsyncStorage.getItem("editPermission").then((existingData) => {
    		this.setState({ 
    			editPermission: existingData 
    		});
    	});
	},

	showHideFoodTypePicker: function () {
		if (this.state.showFoodTypeSelector == true) {
			this.setState({showFoodTypeSelector: false, showHideFoodTypePickerButtonText: "Đổi cách chế biến"});
		}
		else {
			this.setState({showFoodTypeSelector: true, showHideFoodTypePickerButtonText: "Chấp nhận"});
		}
	},

	onFoodNameChange: function(event) {
		var tempFoodObject = this.state.foodObject;
		tempFoodObject.MonAnName = event.nativeEvent.text
		this.setState({ foodObject: tempFoodObject });
	},

	onFoodDescriptionChange: function(event) {
		var tempFoodObject = this.state.foodObject;
		tempFoodObject.MonAnDescription = event.nativeEvent.text
		this.setState({ foodObject: tempFoodObject });
	},

	onFoodTypePickerChange: function(selectedFoodType) {

		for (var i=0; i < this.state.foodTypeArray.length; i++) {
			if (this.state.foodTypeArray[i].value == selectedFoodType) {
				var selectedFoodTypeText = this.state.foodTypeArray[i].name;
				break; //If match, then end the loop immediately
			}
			else {
				var selectedFoodTypeText = "Không xác định";
			}
		}

		var selectedTypeObject = [];
		selectedTypeObject['LoaiMonAnID'] = selectedFoodType;
		selectedTypeObject['LoaiMonAnDescription'] = selectedFoodTypeText;
		this.setState({foodType: selectedTypeObject});
		
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
						isLoading: false,
						showCurrentFoodImage: false,
					});
		        }
	        }
	    });
	},

	//Code to handle the update button
	onUpdateFoodDetailPressed: function() {

		//First do the validation
		var bValidationPass = false;
		var missingInfo = "Bạn chưa nhập các thông tin sau:";

		//Initially check for the login user
		if (this.state.foodObject.MonAnName == "") {
			bValidationPass = false;
			missingInfo = missingInfo + "\nTên món ăn";
		}
		else {
			bValidationPass = true;
		}

		if (this.state.foodType.LoaiMonAnID <= 0) {
			bValidationPass = false;
			missingInfo = missingInfo + "\nCách chế biến";
		}
		else {
			bValidationPass = true;
		}
		
		//If all validation passed, then we can continue to add the food
		if (bValidationPass == true) {
			var searchString = this.state.searchString;
			var searchURL = "http://lugagi.com/script/food/updatemonan.php";
			var fetchBody = "";

			fetchBody = fetchBody + "CurrentUserID=" + this.state.currentUserID;
			fetchBody = fetchBody + "&EditPermission=" + this.state.editPermission;
			fetchBody = fetchBody + "&MonAnID=" + this.state.foodObject.MonAnID;
			fetchBody = fetchBody + "&TenMon=" + this.state.foodObject.MonAnName;
			fetchBody = fetchBody + "&MoTa=" + this.state.foodObject.MonAnDescription;
			fetchBody = fetchBody + "&LoaiMonAn=" + this.state.foodType.LoaiMonAnID;
			fetchBody = fetchBody + "&currentImageName=" + this.state.foodObject.ImageFileName;
			fetchBody = fetchBody + "&UpdateMode=" + "update";

			if (this.state.foodImageSource.uri) {
				fetchBody = fetchBody + "&foodImageString=" + encodeURIComponent(this.state.foodImageSource.uri); 
			}

			//Display the loading icon
			this.setState({ isLoading: true});

			fetch(searchURL, {method: "POST", body: fetchBody})
	        .then((response) => response.json())
	        .then((responseData) => {
	        		this.setState({ isLoading: false });

	        		var submitStatus = responseData.UpdateFoodResult[0].Status;

	        		if (submitStatus == "success") {
					    this.goToFoodDetail();
					}
					else {
						Alert.alert(
				            'Không thể tạo món mới',
				            responseData.UpdateFoodResult[0].ErrorMessage
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
	},

	goToFoodDetail: function() {
		var FoodDetail = require('./FoodDetail.js');
		this.props.navigator.resetTo({
			title: 'Món ăn',
			component: FoodDetail,
			passProps: {foodID: this.state.foodObject.MonAnID},
		});
	},

	cancelEditFood: function() {
		this.props.navigator.pop();
	},

	goToHome: function() {
		var LugagiHome = require('./LugagiHome.js');
		this.props.navigator.resetTo({
			title: 'Món ăn',
			component: LugagiHome
		});
	},

	render: function() {
		var spinner = this.state.isLoading ?
			( <ActivityIndicatorIOS
			  hidden='true'
			  size='large'/> ) :
			( <View/>);

		var foodTypePicker = this.state.showFoodTypeSelector ?
		(	<Picker
				style={lugagistyle.picker}
				selectedValue={this.state.foodType.LoaiMonAnID}
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

		var foodImage;
		if (this.state.showCurrentFoodImage == true) {
			foodImage = (<Image source={{uri: this.state.foodImageSource}}
								style={styles.thumb}/>
						);
		}
		else {
			foodImage = (<Image source={this.state.foodImageSource}
								style={styles.thumb}/>
						);
		}

		return (
			<ScrollView style={[lugagistyle.appBodyContainer, lugagistyle.formBackground]}>

					<View style={lugagistyle.form}>

						<Text style={[lugagistyle.formLabel, lugagistyle.textBold]}>Tên món ăn</Text>
						<View style={lugagistyle.formControl}>
						  	<TextInput
							    style={lugagistyle.formInput}
							    value={this.state.foodObject.MonAnName}
							    onChange={this.onFoodNameChange}
							    placeholder='Ví dụ: Cá lóc kho tộ'/>
						</View>

						<Text style={[lugagistyle.formLabel, lugagistyle.textBold]}>Mô tả</Text>
						<View style={lugagistyle.formControl}>
						  	<TextInput
							    style={lugagistyle.formTextArea}
							    value={this.state.foodObject.MonAnDescription}
							    onChange={this.onFoodDescriptionChange}
							    multiline={true}
							    numberOfLines={5}
							    placeholder='Ví dụ: Cá lóc kho tộ là món ngon của miền Nam, rất đơn giản nhưng rất đậm đà'/>
						</View>

						<Text style={[lugagistyle.formLabel, lugagistyle.textBold]}>Cách chế biến</Text>
						<View style={lugagistyle.formControl}>
							<Text style={lugagistyle.buttonTextNormal}>{this.state.foodType.LoaiMonAnDescription}</Text>
							<TouchableOpacity
							    onPress={this.showHideFoodTypePicker}>
							  <Text style={lugagistyle.buttonTextAccent}>{this.state.showHideFoodTypePickerButtonText}</Text>
							</TouchableOpacity>
						</View>

						{foodTypePicker}

						<Text style={[lugagistyle.formLabel, lugagistyle.textBold]}>Hình ảnh</Text>
						<View style={lugagistyle.formControl}>
							<TouchableOpacity
							    onPress={this.onSelectImageClicked}>
							  <Text style={lugagistyle.buttonTextAccent}>Bấm để chọn ảnh cho món ăn</Text>
							</TouchableOpacity>

							{foodImage}

							{spinner}
						</View>

						<Text style={[lugagistyle.formLabel, lugagistyle.textBold]}>Hoàn tất</Text>
						<View style={lugagistyle.formControl}>
							<TouchableOpacity 
								style={[lugagistyle.buttonAccent]}
							    onPress={this.onUpdateFoodDetailPressed}>
							  <Text style={lugagistyle.buttonTextAccent}>LƯU</Text>
							</TouchableOpacity>
						</View>

						<View style={lugagistyle.formControl}>
							<TouchableOpacity 
								style={[lugagistyle.buttonPrimary]}
							    onPress={this.cancelEditFood}>
							  <Text style={lugagistyle.buttonTextPrimary}>HỦY BỎ</Text>
							</TouchableOpacity>
						</View>
					</View>

			</ScrollView>
		);
	},

});

//Export the class and permit its use in other files
module.exports = EditFoodDetail;