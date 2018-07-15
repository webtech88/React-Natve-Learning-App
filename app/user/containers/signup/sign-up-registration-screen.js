import PropTypes from 'prop-types'
import React from 'react'

import { connect } from 'react-redux'

import UserActions from '../../actions/creator'
import SignUpRegistration from '../../components/sign-up-registration'


const SignUpRegistrationScreen = ({
	attempting,
	validateRegistrationNumber,
	errors,
}) =>
	(<SignUpRegistration
		attempting={attempting}
		onSignUpRegistration={validateRegistrationNumber}
		errors={errors}
	/>)

SignUpRegistrationScreen.propTypes = {
	attempting: PropTypes.bool.isRequired,
	validateRegistrationNumber: PropTypes.func.isRequired,
	errors: PropTypes.object,
}

SignUpRegistrationScreen.defaultProps = {
	errors: null,
}


// Redux mappings
const mapStateToProps = state => ({
	attempting: state.user.attemptingValidateRegistrationNumber,
	errors: state.user.errors,
})

const mapDispatchToProps = dispatch => ({
	validateRegistrationNumber: (values, func, form) => {
		if (form && form.valid) {
			dispatch(UserActions.validateRegistrationNumberAttempt(values))
		}
	},
})

export default connect(mapStateToProps, mapDispatchToProps)(SignUpRegistrationScreen)
