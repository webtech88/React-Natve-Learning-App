import React from 'react'

import { connect } from 'react-redux'

import UserActions from '../../actions/creator'

import SettingsFormCurrentPassword from '../../components/settings/settings-form-current-password'

const SettingsCurrentPasswordScreen = ({
	attempting,
	initialValues,
	onVerifyPasswordAttempt,
}) =>
	(<SettingsFormCurrentPassword
		attempting={attempting}
		initialValues={initialValues}
		onVerifyPasswordAttempt={onVerifyPasswordAttempt}
	/>)

// Redux mappings
const mapStateToProps = state => ({
	attempting: state.auth.attemptingVerifyPassword,
	initialValues: {
		email: state.user.data.email,
	},
})

const mapDispatchToProps = dispatch => ({
	onVerifyPasswordAttempt: (values, func, form) => {
		if (form && form.valid) {
			dispatch(UserActions.verifyPasswordAttempt(values))
		}
	},
})

export default connect(mapStateToProps, mapDispatchToProps)(SettingsCurrentPasswordScreen)
