import { takeEvery, put, call, fork } from 'redux-saga/effects'
import { Actions as NavigationActions } from 'react-native-router-flux'

import Type from '../actions/type'
import CoreActions from '../../core/actions/creator'
import UserActions from '../actions/creator'
import { translate } from '../../core/config/lang'


export default (api) => {
	function* forgotPasswordAttempt(action) {
		try {
			const response = yield call(api.forgotPassword, action.email)

			if (response && response.ok && response.data && response.data.status === 'success') {
				const message = (response && response.data && response.data.message)
					|| 'Please check your email to reset password.'
				yield call(NavigationActions.pop)
				yield put(UserActions.forgotPasswordSuccess(message))
			} else {
				const problem = (response && response.data && response.data.data && response.data.data.email)
					|| 'Email is required.'
				yield put(UserActions.forgotPasswordFailure(problem))
			}
		} catch (err) {
			yield put(UserActions.forgotPasswordFailure(err))
		}
	}

	function* forgotPasswordSuccess(action) {
		const { message } = action
		yield put(CoreActions.setNotification('success', yield translate(message)))
	}

	function* forgotPasswordFailure(action) {
		const { errorCode } = action
		yield put(CoreActions.setNotification('danger', yield translate(errorCode)))
	}


	function* verifyPasswordAttempt(action) {
		const { user } = action

		try {
			const response = yield call(api.login, user)

			if (response && response.ok && response.data && response.data.status === 'success'
				&& response.data.data && response.data.data.token) {
				yield call(() => NavigationActions.SettingsNewPassword({ password: user.password }))
				yield put(UserActions.verifyPasswordSuccess(response.data.data.token))
			} else {
				const problem = 'Password was not correct.'
				yield put(UserActions.verifyPasswordFailure(problem))
			}
		} catch (err) {
			yield put(UserActions.verifyPasswordFailure(err))
		}
	}

	function* verifyPasswordSuccess(action) {
		const { token } = action

		if (token) {
			api.setAuthToken(token)
		}
	}

	function* verifyPasswordFailure(action) {
		const { errorCode } = action
		yield put(CoreActions.setNotification('danger', yield translate(errorCode)))
	}


	function* updatePasswordAttempt(action) {
		const { user: { member_id, ...user } } = action

		try {
			const response = yield call(api.updateUser, member_id, user)

			if (response && response.ok && response.data && response.data.status === 'success') {
				// const message = response.data.message || 'Password updated.';
				const message = 'Password updated.'
				yield put(UserActions.updatePasswordSuccess(message))
			} else {
				const problem = 'Password update failed.'
				yield put(UserActions.updatePasswordFailure(problem))
			}
		} catch (err) {
			yield put(UserActions.updatePasswordFailure(err))
		}
	}

	function* updatePasswordSuccess(action) {
		const { message } = action

		yield call(() => NavigationActions.popTo('SettingsMenu'))

		if (message) {
			yield put(CoreActions.setNotification('success', yield translate(message)))
		}
	}

	function* updatePasswordFailure(action) {
		const { errorCode } = action
		yield put(CoreActions.setNotification('danger', yield translate(errorCode)))
	}

	// The Main Watcher function
	function* startWatchers() {
		yield fork(takeEvery, Type.FORGOT_PASSWORD_ATTEMPT, forgotPasswordAttempt)
		yield fork(takeEvery, Type.FORGOT_PASSWORD_SUCCESS, forgotPasswordSuccess)
		yield fork(takeEvery, Type.FORGOT_PASSWORD_FAILURE, forgotPasswordFailure)
		yield fork(takeEvery, Type.VERIFY_PASSWORD_ATTEMPT, verifyPasswordAttempt)
		yield fork(takeEvery, Type.VERIFY_PASSWORD_SUCCESS, verifyPasswordSuccess)
		yield fork(takeEvery, Type.VERIFY_PASSWORD_FAILURE, verifyPasswordFailure)
		yield fork(takeEvery, Type.UPDATE_PASSWORD_ATTEMPT, updatePasswordAttempt)
		yield fork(takeEvery, Type.UPDATE_PASSWORD_SUCCESS, updatePasswordSuccess)
		yield fork(takeEvery, Type.UPDATE_PASSWORD_FAILURE, updatePasswordFailure)
	}

	return {
		startWatchers,
	}
}
