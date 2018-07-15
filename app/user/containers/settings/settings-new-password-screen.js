import React from 'react'

import { connect } from 'react-redux'

import UserActions from '../../actions/creator'
import SettingsFormNewPassword from '../../components/settings/settings-form-new-password'

const SettingsNewPasswordScreen = ({
	attempting,
	userId,
	password,
	onUpdatePasswordAttempt,
}) =>
	(<SettingsFormNewPassword
		attempting={attempting}
		initialValues={{ member_id: userId, password_current: password }}
		onUpdatePasswordAttempt={onUpdatePasswordAttempt}
	/>)

// Redux mappings
const mapStateToProps = state => ({
	userId: state.user.data.member_id,
	attempting: state.user.updatingUser,
})

const mapDispatchToProps = dispatch => ({
	onUpdatePasswordAttempt: (values, func, form) => {
		if (form && form.valid) {
			dispatch(UserActions.updatePasswordAttempt(values))
		}
	},
})

export default connect(mapStateToProps, mapDispatchToProps)(SettingsNewPasswordScreen)
