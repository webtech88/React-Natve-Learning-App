import { StyleSheet, Platform } from 'react-native'
// TODO can't import metrics here because metrics imports size() from here
import Dimensions from 'Dimensions'

const { width } = Dimensions.get('window')


const size = (size, increase = false) => {
	const ratio = 375 / width
	// if (!increase && ratio < 1) ratio = 1;
	// console.log(Math.ceil(size/ratio));

	// return size;
	return Math.ceil(size / ratio)
}

const create = (styles) => {
	const platformStyles = {}

	Object.keys(styles).forEach((name) => {
		const { ios, android, ...otherStyles } = { ...styles[name] }
		let style = otherStyles

		if (ios && Platform.OS === 'ios') {
			style = { ...style, ...ios }
		}

		if (android && Platform.OS === 'android') {
			style = { ...style, ...android }
		}

		platformStyles[name] = style
	})

	return StyleSheet.create(platformStyles)
}

export default { size, create }
