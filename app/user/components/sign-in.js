import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
	View,
	Text,
	TouchableHighlight,
} from 'react-native'
import { Field, reduxForm } from 'redux-form'

import common from '../../common'
import ss from '../../styles'

const { Button, TransText, TransTouchable } = common.components.core
const { Form, TextField } = common.components.form
const { FormUtil } = common.util

class SignIn extends Component {

	state = {
		keyboardIsOpen: false,
	}

	handleFocusNext = (ref) => {
		if (ref) {
			const { name } = ref.props

			const input = ref.getRenderedComponent().refs[name]

			if (input) {
				input.focus()
			}
		}
	}

	handleFormStateChange = (state) => {
		this.setState({
			keyboardIsOpen: state.keyboardIsOpen,
		})
	}

	render() {
		const {
			anyTouched, valid, handleSubmit,
			gettingUser,
			attemptingLoginWithEmail,
			attemptingLoginWithFacebook,
			onLoginWithEmail,
			onLoginWithSocial,
			onForgotPasswordPress,
		} = this.props
		const attempting = (gettingUser || attemptingLoginWithEmail || attemptingLoginWithFacebook)
		const canAttempt = !attempting && anyTouched && valid

		return (
			<View style={styles.wrapper}>
				<Form
					style={styles.container}
					onStateChange={this.handleFormStateChange}
				>
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
							onSubmitEditing={handleSubmit(onLoginWithEmail)}
						/>
						<TransTouchable
							style={{ marginTop: 10, marginBottom: 20 }}
							underlayColor="transparent"
							onPress={onForgotPasswordPress}
							textstyle={styles.link}
							textstring="FORGET_PASSWORD"
						/>
						<Button
							style={{ marginBottom: 25 }}
							label="Sign In"
							isLoading={attemptingLoginWithEmail}
							disabled={!canAttempt}
							onPress={handleSubmit(onLoginWithEmail)}
						/>
					</View>
					{!this.state.keyboardIsOpen && <View style={styles.social}>
						<View style={styles.hr}>
							<View style={styles.hrBorder} />
							<TransText style={[styles.p, styles.hrParagraph]} transkey="OR_SIGN_IN_WITH_SOCIAL" />
							<View style={styles.hrBorder} />
						</View>
						<View style={styles.socialIcons}>
							{/* <View style={{flex: 1, marginRight: 5}}>
								<Button
									height={44}
									color="#FE4A34"
									iconName="google-plus"
									iconSize={20}
									onPress={() => null}
								/>
							</View>
							<View style={{flex: 1, marginLeft: 5, marginRight: 5}}>
								<Button
									height={44}
									color="#00ABD6"
									iconName="twitter"
									onPress={() => null}
								/>
							</View> */}
							{/* <View style={{flex: 1, marginLeft: 5}}> */}
							<Button
								// height={44}
								color="#27599A"
								label="Sign in with Facebook"
								iconName="facebook"
								onPress={() => onLoginWithSocial('facebook')}
								isLoading={attemptingLoginWithFacebook}
								disabled={attempting}
							/>
							{/* </View> */}
						</View>
					</View>}
				</Form>
			</View>
		)
	}

}

SignIn.propTypes = {
	anyTouched: PropTypes.bool.isRequired,
	valid: PropTypes.bool.isRequired,
	handleSubmit: PropTypes.func.isRequired,
	gettingUser: PropTypes.bool.isRequired,
	attemptingLoginWithEmail: PropTypes.bool.isRequired,
	attemptingLoginWithFacebook: PropTypes.bool.isRequired,
	onLoginWithEmail: PropTypes.func.isRequired,
	onLoginWithSocial: PropTypes.func.isRequired,
	onForgotPasswordPress: PropTypes.func.isRequired,
}


// StyleSheet
const {
	size,
	base: { wrapper, hr, hrBorder, hrParagraph },
	typo: { p, link },
} = ss

const styles = ss.create({
	wrapper: {
		...wrapper,
		// backgroundColor: 'gray', // NOTE testing flexbox
	},
	container: {
		// backgroundColor: 'red', // NOTE testing flexbox
		ios: {
			justifyContent: 'center',
		},
		paddingHorizontal: size(30),
	},
	form: {
		backgroundColor: 'white',
		// backgroundColor: 'red', // NOTE testing flexbox
		ios: {
			zIndex: 1,
		},
	},
	social: {
		// backgroundColor: 'blue', // NOTE testing flexbox
	},
	socialIcons: {
		// backgroundColor: 'pink', // NOTE testing flexbox
		// flexDirection: 'row',
		marginBottom: size(20),
	},
	p: {
		...p,
		textAlign: 'center',
		backgroundColor: 'transparent',
	},
	link: {
		...link,
		textAlign: 'center',
	},
	hr,
	hrBorder,
	hrParagraph,
})


const validate = (values) => {
	const errors = {}

	FormUtil.validate(values, errors, 'email').email().required('Email is required.')
	FormUtil.validate(values, errors, 'password').required('Password is required.')

	return errors
}

export default reduxForm({ form: 'signInForm', destroyOnUnmount: true, validate })(SignIn)
