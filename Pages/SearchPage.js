'use strict';
 
var React = require('react-native');
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
  ListView,
  ScrollView,
  Alert
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
		margin: 20,
		flex: 4,
		fontSize: 18,
		borderWidth: 1,
		borderColor: '#48BBEC',
		borderRadius: 3,
		color: '#48BBEC'
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
var SearchPage =  React.createClass({
	getInitialState: function() {
		return {
			searchString: '',
			isLoading: false, 
			message: '',
			searchResultDataSource: new ListView.DataSource({
		    	rowHasChanged: (row1, row2) => row1 !== row2,
		  	}),
		};
	},

	//Code to handle change in search textbox content
	onSearchTextChanged: function(event) {
		this.setState({ searchString: event.nativeEvent.text });
	},

	//Code to handle the find button
	onSearchPressed: function() {
		if (this.state.searchString != '') {
			var searchString = this.state.searchString;
			var searchURL = "http://lugagi.com/script/smartPhoneAPI/search/search.php?searchName=" + searchString;
			
			//Display the loading icon
			this.setState({ isLoading: true });

			fetch(searchURL, {method: "GET"})
	        .then((response) => response.json())
	        .then((responseData) => {
	        	console.log(responseData);
	        	this.setState({
			      searchResultDataSource: this.state.searchResultDataSource.cloneWithRows(responseData.FoodSearchResults)
			    });
			    this.props.navigator.push({
				  title: 'Kết quả',
				  id: 'SearchResults',
				  type: 'Modal',
				  passProps: {searchResultDataSource: responseData.FoodSearchResults}
				});
	        })
	        .done(() => {
	        	//Hide the loading icon
	        	this.setState({ isLoading: false });
	        });
    	}
    	else {
    		Alert.alert("Bạn phải nhập ít nhất 2 kí tự để tìm kiếm");
    	}
	},

	//Render the page
  	render: function() {
  		var spinner = this.state.isLoading ?
			( <ActivityIndicatorIOS
			  hidden='true'
			  size='large'/> ) :
			( <View/>);
	    return (
	      	<ScrollView style={[lugagistyle.appBodyContainer, lugagistyle.formBackground]}>

		        <View style={lugagistyle.form}>

				  	<View style={lugagistyle.formControl}>
					  	<TextInput
						    style={lugagistyle.formInput}
						    value={this.state.searchString}
						    onChange={this.onSearchTextChanged}
						    placeholder='Nhập tên món ăn hoặc bộ sưu tập'/>
					</View>

					<View style={lugagistyle.formControl}>
						<TouchableOpacity 
							style={styles.buttonAccent}
						    onPress={this.onSearchPressed}>
						  <Text style={lugagistyle.buttonTextAccent}>Tìm kiếm</Text>
						</TouchableOpacity>
					</View>

					{spinner}
				</View>

	      </ScrollView>
	    );
  	},
});

//Export the class and permit its use in other files
module.exports = SearchPage;