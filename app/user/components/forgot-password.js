import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { View } from 'react-native'

import { Field, reduxForm } from 'redux-form'

import ss from '../../styles'
import common from '../../common'

const { FormUtil } = common.util
const { Button, TransText } = common.components.core
const { Form, TextField } = common.components.form


class ForgotPassword extends Component {

	render() {
		const {
			valid, handleSubmit,
			attempting,
			onForgotPassword,
		} = this.props
		// TODO BUG anyTouched remains false if form has only 1 field
		const canAttempt = !attempting && valid

		return (
			<View style={styles.wrapper}>
				<Form style={styles.container}>
					<View style={styles.header}>
						<TransText style={styles.h1} transkey="RESET_PASSWORD" />
						<TransText style={styles.pLight} transkey="WILL_SEND_RECOVERY_LINK" />
					</View>
					<View style={styles.form}>
						<Field
							ref={(c) => { this.email = c }}
							withRef
							name="email"
							label="Email"
							component={TextField}
							keyboardType="email-address"
							autoCorrect={false}
							autoCapitalize="none"
							editable={!attempting}
							disabled={attempting}
							onSubmitEditing={handleSubmit(onForgotPassword)}
						/>
						<Button
							style={{ marginVertical: 20 }}
							label="Send Me a Link"
							isLoading={attempting}
							disabled={!canAttempt}
							onPress={handleSubmit(onForgotPassword)}
						/>
					</View>
				</Form>
			</View>
		)
	}

}

ForgotPassword.propTypes = {
	valid: PropTypes.bool.isRequired,
	handleSubmit: PropTypes.func.isRequired,
	attempting: PropTypes.bool.isRequired,
	onForgotPassword: PropTypes.func.isRequired,
}


// StyleSheet
const {
	size,
	base: { wrapper },
	typo: { h1, pLight },
} = ss

const styles = ss.create({
	wrapper: {
		...wrapper,
		// backgroundColor: 'gray', // NOTE testing flexbox
	},
	container: {
		// backgroundColor: 'red', // NOTE testing flexbox
		justifyContent: 'center',
		paddingHorizontal: size(30),
	},
	header: {
		// backgroundColor: 'green', // NOTE testing flexbox
		marginVertical: size(20),
	},
	form: {
		// backgroundColor: 'pink', // NOTE testing flexbox
		marginBottom: size(20),
	},
	h1: {
		...h1,
		textAlign: 'center',
		marginBottom: size(10),
	},
	pLight: {
		...pLight,
		textAlign: 'center',
		fontSize: size(18),
	},
})

const validate = (values) => {
	const errors = {}

	FormUtil.validate(values, errors, 'email').email().required()

	return errors
}

const ForgotPasswordComponent = reduxForm({
	form: 'forgotPasswordForm',
	destroyOnUnmount: true,
	shouldValidate: () => true,
	validate,
})(ForgotPassword)

export default ForgotPasswordComponent
