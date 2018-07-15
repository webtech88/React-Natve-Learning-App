import PropTypes from 'prop-types'
import React from 'react'

import DismissKeyboard from 'dismissKeyboard'

import { Actions as NavigationActions } from 'react-native-router-flux'

import { connect } from 'react-redux'

import SignUp from '../../components/sign-up'
import UserActions from '../../actions/creator'


const SignUpScreen = ({
	attempting,
	register,
	navigateToSignIn,
	errors,
}) =>
	(<SignUp
		attempting={attempting}
		onRegister={register}
		onFooterPress={navigateToSignIn}
		errors={errors}
	/>)

SignUpScreen.propTypes = {
	attempting: PropTypes.bool.isRequired,
	register: PropTypes.func.isRequired,
	navigateToSignIn: PropTypes.func.isRequired,
	errors: PropTypes.object,
}

SignUpScreen.defaultProps = {
	errors: null,
}


// Redux mappings
const mapStateToProps = state => ({
	attempting: state.auth.attemptingRegister || state.user.gettingUser,
	errors: state.auth.errors,
})

const mapDispatchToProps = dispatch => ({
	register: (values, func, form) => {
		if (form && form.valid) {
			dispatch(UserActions.registerAttempt(values))
		}
	},
	navigateToSignIn: () => {
		DismissKeyboard()
		NavigationActions.SignIn()
	},
})

export default connect(mapStateToProps, mapDispatchToProps)(SignUpScreen)
