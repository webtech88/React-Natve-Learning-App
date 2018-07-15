import PropTypes from 'prop-types'
import React from 'react'

import DismissKeyboard from 'dismissKeyboard'
import { connect } from 'react-redux'
import { Actions as NavigationActions } from 'react-native-router-flux'

import UserActions from '../../actions/creator'
import SignIn from '../../components/sign-in'

const SignInScreen = ({
	gettingUser,
	attemptingLoginWithEmail,
	attemptingLoginWithFacebook,
	loginWithEmail,
	loginWithFacebook,
	navigateToForgotPassword,
}) => {
	const handleSocialLoginAttempt = (service) => {
		if (service === 'facebook') {
			loginWithFacebook()
		}
	}

	return (
		<SignIn
			gettingUser={gettingUser}
			attemptingLoginWithEmail={attemptingLoginWithEmail}
			attemptingLoginWithFacebook={attemptingLoginWithFacebook}
			onLoginWithEmail={loginWithEmail}
			onLoginWithSocial={service => handleSocialLoginAttempt(service)}
			onForgotPasswordPress={navigateToForgotPassword}
		/>
	)
}

SignInScreen.propTypes = {
	gettingUser: PropTypes.bool.isRequired,
	attemptingLoginWithEmail: PropTypes.bool.isRequired,
	attemptingLoginWithFacebook: PropTypes.bool.isRequired,
	loginWithEmail: PropTypes.func.isRequired,
	loginWithFacebook: PropTypes.func.isRequired,
	navigateToForgotPassword: PropTypes.func.isRequired,
}


// Redux mappings
const mapStateToProps = state => ({
	gettingUser: state.user.gettingUser,
	attemptingLoginWithEmail: state.auth.attemptingLoginWithEmail,
	attemptingLoginWithFacebook: state.auth.attemptingLoginWithFacebook,
})

const mapDispatchToProps = dispatch => ({
	loginWithEmail: (values, func, form) => {
		if (form && form.valid) {
			dispatch(UserActions.loginWithEmailAttempt(values))
		}
	},
	loginWithFacebook: () => dispatch(UserActions.loginWithFacebookAttempt()),
	navigateToForgotPassword: () => {
		DismissKeyboard()
		NavigationActions.ForgotPassword()
	},
})


export default connect(mapStateToProps, mapDispatchToProps)(SignInScreen)
