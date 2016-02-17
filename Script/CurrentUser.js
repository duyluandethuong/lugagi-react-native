'use strict';
var React = require('react-native');

var CurrentUser = React.createClass({
	getInitialState: function() {
		return {
			currentUserID: null,
			currentUsername: null,
			currentUserProfileImageURL: null,
		};
	},

	componentDidMount: function() {
		this.getCurrentUser();
	},

	async getCurrentUser() {
		try {
		  var getCurrentUserID = await AsyncStorage.getItem("currentUserID");
		  if (getCurrentUserID !== null){
		    this.setState({currentUserID: getCurrentUserID});
		  } else {
		    this.setState({currentUserID: null});
		  }
		} catch (error) {
		  //error.message
		}
	},

	render: function() {
		return (<View/>);
	},

	
});

module.exports = CurrentUser;