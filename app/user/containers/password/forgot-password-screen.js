import PropTypes from 'prop-types'
import React from 'react'

import { connect } from 'react-redux'

import ForgotPassword from '../../components/forgot-password'
import UserActions from '../../actions/creator'

const ForgotPasswordScreen = ({
	attempting,
	forgotPassword,
}) =>
	(<ForgotPassword
		attempting={attempting}
		onForgotPassword={forgotPassword}
	/>)

ForgotPasswordScreen.propTypes = {
	attempting: PropTypes.bool.isRequired,
	forgotPassword: PropTypes.func.isRequired,
}


// Redux mappings
const mapStateToProps = state => ({
	attempting: state.auth.attemptingRequestForgotPassword,
})

const mapDispatchToProps = dispatch => ({
	forgotPassword: (values, func, form) => {
		if (form && form.valid) {
			dispatch(UserActions.forgotPasswordAttempt(values))
		}
	},
})

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordScreen)
