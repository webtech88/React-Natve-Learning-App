import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
	View,
	TouchableOpacity,
} from 'react-native'

import { Actions as NavigationActions } from 'react-native-router-flux'
import { Field, reduxForm } from 'redux-form'

import ss from '../../../styles'
import common from '../../../common'

const { Form, TextField } = common.components.form
const { FormUtil } = common.util
const { TransText } = common.components.core


class SettingsFormPhone extends Component {
	render() {
		const { attempting } = this.props

		return (
			<View style={styles.wrapper}>
				<Form style={styles.container}>
					<View style={styles.form}>
						<Field
							ref={(c) => { this.uk_mobile_number = c }}
							withRef
							name="uk_mobile_number"
							label="Mobile"
							component={TextField}
							keyboardType="numeric"
							editable={!attempting}
							disabled={attempting}
						/>
					</View>
					<View>
						<TransText style={styles.p} transkey="DONT_MISS_ANYTHING" />
						<TransText style={[styles.p, { marginBottom: size(20) }]} transkey="SEND_NEWS_DIRECTLY" />
						<TouchableOpacity
							activeOpacity={0.9}
							onPress={NavigationActions.SettingsNotifications}
						>
							<TransText style={styles.link} transkey="SETUP_PHONE_NOTIFICATION" />
						</TouchableOpacity>
					</View>
				</Form>
			</View>
		)
	}
}

SettingsFormPhone.propTypes = {
	attempting: PropTypes.bool.isRequired,
	initialValues: PropTypes.shape({
		uk_mobile_number: PropTypes.string.isRequired,
	}).isRequired,
}


// StyleSheet
const {
	size,
	base: { wrapper },
	typo: { p, link },
} = ss

const styles = ss.create({
	wrapper: {
		...wrapper,
	},
	container: {
		// backgroundColor: 'red', // NOTE testing flexbox
		paddingHorizontal: size(20),
		paddingVertical: size(30),
	},
	form: {
		// backgroundColor: 'pink', // NOTE testing flexbox
		flex: 1,
	},
	p: {
		...p,
		textAlign: 'center',
		opacity: 0.8,
		lineHeight: size(20),
		paddingHorizontal: size(30),
	},
	link: {
		...link,
		textAlign: 'center',
	},
})


const validate = (values, props) => {
	const { errors: apiErrors } = props
	const errors = {}

	// TODO valid uk mobile number ??

	// local validation
	FormUtil.validate(values, errors, 'uk_mobile_number').required()

	// api validation
	if (apiErrors && apiErrors.uk_mobile_number) errors.uk_mobile_number = apiErrors.uk_mobile_number

	return errors
}

SettingsFormPhone = reduxForm({
	form: 'settingsFormPhone',
	destroyOnUnmount: true,
	shouldValidate: () => true,
	validate,
})(SettingsFormPhone)

export default SettingsFormPhone
