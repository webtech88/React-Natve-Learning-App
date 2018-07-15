import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
	Platform,
	DatePickerIOS,
} from 'react-native'

import ss from '../../../styles'

const DatePicker = ({
	date,
	onDateChange,
	...otherProps
}) => ((Platform.OS !== 'ios')
	? null
	: (
		<DatePickerIOS
			style={styles.picker}
			date={date}
			onDateChange={onDateChange}
			{...otherProps}
		/>
))


DatePicker.propTypes = {
	// date: DatePickerIOS.propTypes.date,
	// onDateChange: DatePickerIOS.propTypes.onDateChange,
	// minimumDate: DatePickerIOS.propTypes.minimumDate,
	// maximumDate: DatePickerIOS.propTypes.maximumDate,
	// mode: DatePickerIOS.propTypes.mode,
	children: PropTypes.node,
}

DatePicker.defaultProps = {
	date: new Date(),
	mode: 'date',
}


// StyleSheet
// const {
// 	size,
// 	typo: { p },
// } = ss;

const styles = ss.create({
	picker: {
		position: 'absolute',
		zIndex: 1,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'white',
		borderTopWidth: 1,
		borderTopColor: '#F9F9F9',
	},
})

export default DatePicker
