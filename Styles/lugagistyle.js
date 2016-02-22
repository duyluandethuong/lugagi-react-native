'use strict';

var React = require('react-native');

var {
  StyleSheet,
} = React;

import Dimensions from 'Dimensions';
var screenWidth = Dimensions.get('window').width;

var accentColor = '#FF5252';
var primaryColor = '#607D8B';

module.exports = StyleSheet.create({
	appBodyContainer: {
		flex: 1,
		paddingTop: 45,
		paddingBottom: 20,
		marginTop: 20,
		marginBottom: 44,
		opacity: 1
	},

	navBar: {
		position: 'absolute',
		top: 0,
		left: 0,
		height: 64,
		flex: 1,
		backgroundColor: primaryColor,
		alignSelf: 'stretch',
		justifyContent: 'center',
	},

	navBarLeftText: {
		color: '#FFFFFF',
		marginTop: 10,
		marginLeft: 10,
		fontSize: 17,
	},

	navBarTitle: {
		color: '#FFFFFF',
		marginTop: 10,
		fontSize: 17,
		fontWeight: '500',
	},


	whiteBackground: {
		backgroundColor: '#FFFFFF',
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
		color: accentColor,
		alignSelf: 'center'
	},
	buttonTextPrimary: {
		fontSize: 18,
		marginTop: 10,
		marginBottom: 10,
		color: primaryColor,
		alignSelf: 'center'
	},
	buttonTextNormal: {
		fontSize: 18,
		marginTop: 10,
		marginBottom: 10,
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
		borderColor: accentColor,
		borderRadius: 4,
		alignSelf: 'stretch',
		justifyContent: 'center'
	},
	buttonPrimaryOutline: {
		height: 36,
		flex: 1,
		borderWidth: 1,
		borderColor: primaryColor,
		borderRadius: 4,
		alignSelf: 'stretch',
		justifyContent: 'center'
	},


	textAccent: {
		color: accentColor
	},
	textAccentContrast: {
		color: '#FFFDFF'
	},

	textPrimary: {
		color: primaryColor
	},

	textWhite: {
		color: '#FFFFFF'
	},

	textTitle: {
		fontSize: 16
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
		borderColor: primaryColor,
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
		borderColor: primaryColor,
		borderRadius: 4,
	},

	textMuted: {
		color: '#808080'
	},
	textBold: {
		fontWeight: 'bold',
	},

	cardTitle: {
		color: accentColor,
		fontSize: 15,
		fontWeight: 'bold',
	},
	picker: {
		marginTop: -10,
	},
	


	form: {
		paddingTop: 5
	},
	formBackground: {
		backgroundColor: '#EFEFF4',
	},
	formControl: {
		paddingLeft: 5,
		backgroundColor: '#FFFFFF',
		marginBottom: 20,
	},
	formLabel: {
		marginLeft: 5,
		marginBottom: 5,
		color: primaryColor,
	},
	formInput: {
		borderWidth: 0,
		height: 36,
		padding: 5,
		fontSize: 16,
	},
	formTextArea: {
		marginTop: 5,
		borderWidth: 0,
		height: 100,
		padding: 5,
		fontSize: 16,
	}

});