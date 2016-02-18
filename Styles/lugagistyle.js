'use strict';

var React = require('react-native');

var {
  StyleSheet,
} = React;

module.exports = StyleSheet.create({

	buttonTextAccent: {
		fontSize: 18,
		marginTop: 10,
		marginBottom: 10,
		color: '#FF5252',
		alignSelf: 'center'
	},
	buttonAccent: {
		height: 36,
		flex: 1,
		borderRadius: 5,
		alignSelf: 'stretch',
		justifyContent: 'center'
	},
	textAccent: {
		color: '#FF5252'
	},
	textPrimary: {
		color: '#607D8B'
	},
	sectionTitle: {
		fontSize: 20,
		marginTop: 10,
		marginBottom: 10,
		marginLeft: 5,
	},
	textInput: {
		height: 36,
		padding: 4,
		marginTop: 10,
		marginBottom: 10,
		marginLeft: 5,
		marginRight: 5,
		fontSize: 16,
		borderWidth: 1,
		borderColor: '#607D8B',
		borderRadius: 2,
	},
	textMuted: {
		color: '#808080'
	},
	cardTitle: {
		color: '#FF5252',
		fontSize: 15,
		fontWeight: 'bold',
	}

});