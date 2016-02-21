'use strict';

var React = require('react-native');

var {
  StyleSheet,
} = React;

module.exports = StyleSheet.create({
	appBodyContainer: {
		flex: 1,
		paddingBottom: 20
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
	textBold: {
		fontWeight: 'bold',
	},
	cardTitle: {
		color: '#FF5252',
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
		marginBottom: 5
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
	},
	listViewContainer: {
  		marginTop: 0,
  		marginBottom: 5,
		flex: 1,
		height: 150,
  	},
  	listViewItemContainer: {
  		marginRight: 5,
	    padding: 5,
	    alignItems: 'center',
	    flex: 1,
    	width: 150,
	    height: 150,
	    backgroundColor: '#F6F6F6',
  	},
  	rightContainer: {
	    flex: 1,
	},
	image: {
		width: 500,
		height: 150,
		justifyContent: 'center',
		alignSelf: 'stretch',
	},
	thumb: {
		width: 150,
		height: 100
	},
	roundThumb: {
		height: 100,
		width: 100,
		borderRadius: 50,
	},

});