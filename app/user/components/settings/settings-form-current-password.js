import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
	View,
	Text,
	TouchableOpacity,
} from 'react-native'

import { Actions as NavigationActions } from 'react-native-router-flux'
import { Field, reduxForm } from 'redux-form'

import ss from '../../../styles'
import common from '../../../common'

const { FormUtil } = common.util
const { Button, TransText } = common.components.core
const { Form, TextField } = common.components.form


class SettingsFormCurrentPassword extends Component {
	render() {
		const { attempting, handleSubmit, onVerifyPasswordAttempt } = this.props
		const { anyTouched, valid } = this.props
		// const canAttempt = !attempting && anyTouched && valid;
		// TODO BUG anyTouched remains false if form has only 1 field
		const canAttempt = !attempting && valid

		return (
			<View style={styles.wrapper}>
				<Form style={styles.container}>
					<TransText style={styles.pLight} transkey="ENTER_CURRENT_PASSWORD" />
					<View style={styles.form}>
						<Field
							ref={(c) => { this.password = c }}
							withRef
							name="password"
							label="Current Password"
							component={TextField}
							secureTextEntry
							editable={!attempting}
							disabled={attempting}
							onSubmitEditing={handleSubmit(onVerifyPasswordAttempt)}
						/>
						<TouchableOpacity
							activeOpacity={0.9}
							onPress={NavigationActions.ForgotPassword}
						>
							{/* <TransText style={[styles.link]} transkey="FORGET_PASSWORD" /> */}
						</TouchableOpacity>
						<Button
							label="Next"
							isLoading={attempting}
							disabled={!canAttempt}
							onPress={handleSubmit(onVerifyPasswordAttempt)}
						/>
					</View>
				</Form>
			</View>
		)
	}
}

SettingsFormCurrentPassword.propTypes = {
	attempting: PropTypes.bool.isRequired,
	initialValues: PropTypes.shape({
		email: PropTypes.string.isRequired,
	}).isRequired,
	onVerifyPasswordAttempt: PropTypes.func.isRequired,
	handleSubmit: PropTypes.func.isRequired,
	valid: PropTypes.bool.isRequired,
}


// StyleSheet
const {
	size,
	base: { wrapper },
	typo: { pLight, link },
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
		justifyContent: 'center',
	},
	pLight: {
		...pLight,
		fontSize: size(18),
	},
	link: {
		...link,
		textAlign: 'center',
		marginVertical: size(20),
	},
})


const validate = (values, props) => {
	const errors = {}

	// local validation
	FormUtil.validate(values, errors, 'password').required('Password is required.')

	return errors
}

SettingsFormCurrentPassword = reduxForm({
	form: 'settingsFormCurrentPassword',
	destroyOnUnmount: true,
	shouldValidate: () => true,
	validate,
})(SettingsFormCurrentPassword)

export default SettingsFormCurrentPassword
