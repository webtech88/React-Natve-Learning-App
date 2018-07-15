import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
	View,
	Text,
} from 'react-native'

import { Field, reduxForm } from 'redux-form'

import ss from '../../../styles'
import common from '../../../common'

const { FormUtil } = common.util
const { Button, TransText } = common.components.core
const { Form, TextField } = common.components.form


class SettingsFormNewPassword extends Component {

	handleFocusNext = (ref) => {
		if (ref) {
			const { name } = ref.props

			const input = ref.getRenderedComponent().refs[name]

			if (input) {
				// // TODO BUG keyboard flickers, need better focus handler
				input.focus()
			}
		}
	}

	render() {
		const { attempting, handleSubmit, anyTouched, valid, onUpdatePasswordAttempt } = this.props
		const canAttempt = !attempting && anyTouched && valid

		return (
			<View style={styles.wrapper}>
				<Form style={styles.container}>
					<TransText style={styles.pLight} transkey="ENTER_NEW_PASSWORD" />
					<View style={styles.form}>
						<Field
							ref={(c) => { this.password_new = c }}
							withRef
							name="password_new"
							label="New Password"
							component={TextField}
							secureTextEntry
							editable={!attempting}
							disabled={attempting}
							onSubmitEditing={() => this.handleFocusNext(this.password_confirm)}
						/>
						<Field
							ref={(c) => { this.password_confirm = c }}
							withRef
							name="password_confirm"
							label="Repeat New Password"
							component={TextField}
							secureTextEntry
							editable={!attempting}
							disabled={attempting}
							onSubmitEditing={handleSubmit(onUpdatePasswordAttempt)}
						/>
						<Button
							style={{ marginTop: size(20) }}
							label="Change Password"
							isLoading={attempting}
							disabled={!canAttempt}
							onPress={handleSubmit(onUpdatePasswordAttempt)}
						/>
					</View>
				</Form>
			</View>
		)
	}
}

SettingsFormNewPassword.propTypes = {
	attempting: PropTypes.bool.isRequired,
	onUpdatePasswordAttempt: PropTypes.func.isRequired,
	handleSubmit: PropTypes.func.isRequired,
	anyTouched: PropTypes.bool.isRequired,
	valid: PropTypes.bool.isRequired,
}


// StyleSheet
const {
	size,
	base: { wrapper },
	typo: { pLight },
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
})


const validate = (values, props) => {
	const errors = {}

	// local validation
	FormUtil.validate(values, errors, 'password_new')
		.required('New Password is required.')
	FormUtil.validate(values, errors, 'password_confirm')
		.required('Repeat New Password is required.')
			.matches('password_new', 'Passwords do not match.')

	return errors
}

SettingsFormNewPassword = reduxForm({
	form: 'settingsFormNewPassword',
	destroyOnUnmount: true,
	shouldValidate: () => true,
	validate,
})(SettingsFormNewPassword)

export default SettingsFormNewPassword
