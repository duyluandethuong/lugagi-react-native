'use strict';
 
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
  ListView,
  ScrollView
} = React;

//Styling
var styles = StyleSheet.create({
	introduction: {
		marginLeft: 10,
		marginRight: 10,
	},
  	searchView: {
		alignItems: 'center',
		alignSelf: 'stretch'
	},
	thumb: {
		width: 80,
		height: 80,
		marginRight: 10
	},
	textContainer: {
		flex: 1
	},
	separator: {
		height: 1,
		backgroundColor: '#dddddd'
	},
	rowContainer: {
		flexDirection: 'row',
		padding: 10
	}
});

//Create class for the page
var IngredientSelection = React.createClass({
	getInitialState: function() {
	    return {
	        isLoading: false,
	        searchString: '',
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
		var searchString = this.state.searchString;

		if (searchString =! null) {
			var searchURL = "http://lugagi.com/script/ingredientRecommendation/generateFoodSuggestion.php?ingredientname[]=" + this.state.searchString;
			console.log(searchURL);
			//Display the loading icon
			this.setState({ isLoading: true });

			fetch(searchURL, {method: "GET"})
		    .then((response) => response.json())
		    .then((responseData) => {
		    	console.log(responseData);
		      	this.setState({
		      		searchResultDataSource: this.state.searchResultDataSource.cloneWithRows(responseData.Foods)
		    	});
		    })
		    .done(() => {
		      //Hide the loading icon
		      this.setState({ isLoading: false });
		    });
		}
		else {
			
		}
	},

	//Code to render the list of returned food
	renderRow: function(content) {
    var fullImageURL = "http://lugagi.com/script/timthumb.php?src=/foodimages/" + content.ImageURL + "&w=100&h=100";
    console.log(fullImageURL);
	    return (
	        <TouchableHighlight 
	            underlayColor='#dddddd'
	            onPress={() => this.contentItemPresses(content.MonAnID, "food")}>
	          <View>
	          	<View style={styles.separator}/>
	            <View style={styles.rowContainer}>
	              <Image style={styles.thumb} source={{uri: fullImageURL}} />
	              <View  style={styles.textContainer}>
	                <Text style={lugagistyle.cardTitle}>{content.MonAnName}</Text>
	                <Text style={lugagistyle.textMuted} 
	                      numberOfLines={3}>{content.MonAnDescription}</Text>
	              </View>
	            </View>
	          </View>
	        </TouchableHighlight>
	    );
	},

	//Navigate to the food page
	contentItemPresses: function(contentID, contentType) {
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
	    return (
	      	<ScrollView style={[lugagistyle.appBodyContainer, lugagistyle.formBackground]}>
	      		
	      		<View style={lugagistyle.form}>

	      			<Text style={[lugagistyle.formLabel]}>Nhập nguyên liệu, cách nhau bằng dấu phẩy</Text>
		      		<View style={lugagistyle.formControl}>
			      		<TextInput
							    style={lugagistyle.formInput}
							    value={this.state.searchString}
							    onChange={this.onSearchTextChanged}
							    placeholder='Ví dụ: ức gà, nấm hương, xà lách...'/>
					</View>

					<View style={lugagistyle.formControl}>
						<TouchableOpacity 
							style={lugagistyle.buttonAccent}
						    underlayColor='#99d9f4'
						    onPress={this.onSearchPressed}>
						  <Text style={lugagistyle.buttonTextAccent}>Gợi ý</Text>
						</TouchableOpacity>
						{spinner}
					</View>
				</View>

				<ListView
			        dataSource={this.state.searchResultDataSource}
			        renderRow={this.renderRow}
			        style={lugagistyle.whiteBackground}/>
	      	</ScrollView>
	    );
  	},

});

//Export the class and permit its use in other files
module.exports = IngredientSelection;