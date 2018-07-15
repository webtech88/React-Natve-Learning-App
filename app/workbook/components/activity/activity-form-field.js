import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
    View,
	ViewPropTypes,
} from 'react-native'

import { Field } from 'redux-form'

import ActivityTextField from './activity-text-field'

import ss from '../../../styles'

class ActivityFormField extends Component {
	render() {
		const { index, label, style, editable } = this.props
		return (
			<View key={index} ref={`Field_${index}`} style={[styles.formField, style]}>
				<Field
					ref={`input${index}`}
					withRef
					name={`input${index}`}
					label={label}
					component={ActivityTextField}
					keyboardType="default"
					returnKeyType="default"
					autoCorrect={false}
					editable={editable}
				/>
			</View>
		)
	}
}


ActivityFormField.propTypes = {
	index: PropTypes.number.isRequired,
	label: PropTypes.string.isRequired,
	style: ViewPropTypes.style,
}

ActivityFormField.defaultProps = {
	style: {},
}

const {
	size,
} = ss

// StyleSheet
const styles = ss.create({
	formField: {
		paddingTop: size(30),
	},
})

export default ActivityFormField
