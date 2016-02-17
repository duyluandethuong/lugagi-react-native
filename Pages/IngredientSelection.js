'use strict';
 
var React = require('react-native');
var FoodDetail = require('./FoodDetail.js');

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
	appBodyContainer: {
		marginTop: 10,
		flex: 1,
	},
	introduction: {
		marginLeft: 20,
		marginRight: 20,
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
		fontSize: 16,
		borderWidth: 1,
		borderColor: '#48BBEC',
		borderRadius: 3,
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
			var searchURL = "http://lugagi.com/script/ingredientRecommendation/generateFoodSuggestion.php?ingredientname[]=" + searchString;
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
	                <Text style={styles.title}>{content.MonAnName}</Text>
	                <Text style={styles.description} 
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
	      	<ScrollView style={styles.appBodyContainer}>
	      		<Text style={styles.introduction}>
	      			Bạn có thể nhập nhiều nguyên liệu bằng cách dùng dấu phẩy khi nhập hoặc nhấn nút chèn nguyên liệu.
	      		</Text>
	      		<View style={styles.TextInputList}>
		      		<TextInput
						    style={styles.searchInput}
						    value={this.state.searchString}
						    onChange={this.onSearchTextChanged.bind(this)}
						    placeholder='Nhập tên món ăn hoặc bộ sưu tập'/>
				</View>
				<View>
					<TouchableOpacity 
						style={styles.button}
					    underlayColor='#99d9f4'
					    onPress={this.onSearchPressed.bind(this)}>
					  <Text style={styles.buttonText}>Gợi ý</Text>
					</TouchableOpacity>
					{spinner}
				</View>
				<ListView
			        dataSource={this.state.searchResultDataSource}
			        renderRow={this.renderRow.bind(this)}/>
	      	</ScrollView>
	    );
  	},

});

//Export the class and permit its use in other files
module.exports = IngredientSelection;