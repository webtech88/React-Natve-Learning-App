import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
	View,
} from 'react-native'

import { Field, reduxForm } from 'redux-form'

import ss from '../../styles'
import common from '../../common'
import FooterSignIn from './sign-in-footer'

const { Button } = common.components.core
const { Form, TextField } = common.components.form
const { FormUtil } = common.util


class SignUp extends Component {

	handleFocusNext = (field) => {
		const { name } = field.props

		if (name) {
			const input = field.getRenderedComponent().refs[name]

			if (input) {
				input.focus()
			}
		}
	}

	render() {
		const {
			anyTouched, valid, handleSubmit,
			attempting,
			onRegister,
			onFooterPress,
		} = this.props
		const canAttempt = !attempting && anyTouched && valid

		return (
			<View style={styles.wrapper}>
				<Form style={styles.container}>
					<View style={styles.form}>
						<Field
							ref={(c) => { this.email = c }}
							withRef
							name="email"
							label="Email"
							component={TextField}
							keyboardType="email-address"
							returnKeyType="next"
							autoCorrect={false}
							autoCapitalize="none"
							editable={!attempting}
							disabled={attempting}
							onSubmitEditing={() => this.handleFocusNext(this.password)}
						/>
						<Field
							ref={(c) => { this.password = c }}
							withRef
							name="password"
							label="Password"
							component={TextField}
							secureTextEntry
							editable={!attempting}
							disabled={attempting}
							onSubmitEditing={handleSubmit(onRegister)}
						/>
						<Button
							style={{ marginVertical: 20 }}
							label="Sign me Up"
							isLoading={attempting}
							disabled={!canAttempt}
							onPress={handleSubmit(onRegister)}
						/>
					</View>
					<FooterSignIn disabled={attempting} onPress={onFooterPress} />
				</Form>
			</View>
		)
	}
}

SignUp.propTypes = {
	anyTouched: PropTypes.bool.isRequired,
	valid: PropTypes.bool.isRequired,
	handleSubmit: PropTypes.func.isRequired,
	attempting: PropTypes.bool.isRequired,
	onRegister: PropTypes.func.isRequired,
	onFooterPress: PropTypes.func.isRequired,
}


// StyleSheet
const {
	size,
	base: { wrapper },
} = ss

const styles = ss.create({
	wrapper: {
		...wrapper,
		// backgroundColor: 'gray', // NOTE testing flexbox
	},
	container: {
		// backgroundColor: 'red', // NOTE testing flexbox
		paddingHorizontal: size(30),
	},
	form: {
		// backgroundColor: 'pink', // NOTE testing flexbox
		flex: 1,
		justifyContent: 'center',
	},
})


const validate = (values, props) => {
	const { errors: apiErrors } = props
	const errors = {}

	// local validation
	FormUtil.validate(values, errors, 'email').email().required('Email is required.')
	FormUtil.validate(values, errors, 'password').required('Password is required.')

	// api validation
	if (apiErrors && apiErrors.email) errors.email = apiErrors.email
	if (apiErrors && apiErrors.password) errors.password = apiErrors.password

	return errors
}

const SignUpComponent = reduxForm({
	form: 'signUpForm',
	destroyOnUnmount: true,
	shouldValidate: () => true,
	validate,
})(SignUp)

export default SignUpComponent
