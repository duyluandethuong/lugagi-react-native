'use strict';

var React = require('react-native');

var {
  StyleSheet,
} = React;

module.exports = StyleSheet.create({
	appBodyContainer: {
		flex: 1,
	},
	center: {
		alignSelf: 'stretch',
		justifyContent: 'center'
	},
	fullWidth: {
		width: 400
	},
	marginNormal: {
		marginTop: 10,
		marginBottom: 10,
		marginLeft: 5,
		marginRight: 5,
	},
	marginDeep: {
		marginTop: 10,
		marginBottom: 10,
		marginLeft: 15,
		marginRight: 15,
	},
	buttonTextAccent: {
		fontSize: 18,
		marginTop: 10,
		marginBottom: 10,
		color: '#FF5252',
		alignSelf: 'center'
	},
	buttonTextPrimary: {
		fontSize: 18,
		marginTop: 10,
		marginBottom: 10,
		color: '#607D8B',
		alignSelf: 'center'
	},
	buttonAccent: {
		height: 36,
		flex: 1,
		alignSelf: 'stretch',
		justifyContent: 'center'
	},
	buttonAccentOutline: {
		height: 36,
		flex: 1,
		borderWidth: 1,
		borderColor: '#FF5252',
		borderRadius: 4,
		alignSelf: 'stretch',
		justifyContent: 'center'
	},
	buttonPrimaryOutline: {
		height: 36,
		flex: 1,
		borderWidth: 1,
		borderColor: '#607D8B',
		borderRadius: 4,
		alignSelf: 'stretch',
		justifyContent: 'center'
	},
	textAccent: {
		color: '#FF5252'
	},
	textAccentContrast: {
		color: '#FFFDFF'
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
	sectionTitleSmall: {
		fontSize: 16,
		marginTop: 10,
		marginBottom: 5,
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
		borderRadius: 4,
	},
	textArea: {
		height: 100,
		padding: 4,
		marginTop: 10,
		marginBottom: 10,
		marginLeft: 5,
		marginRight: 5,
		fontSize: 16,
		borderWidth: 1,
		borderColor: '#607D8B',
		borderRadius: 4,
	},
	textMuted: {
		color: '#808080'
	},
	cardTitle: {
		color: '#FF5252',
		fontSize: 15,
		fontWeight: 'bold',
	},
	picker: {
		marginTop: -10,
	}

});