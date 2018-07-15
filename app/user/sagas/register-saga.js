import { takeEvery, put, call, fork } from 'redux-saga/effects'
import { Actions as NavigationActions } from 'react-native-router-flux'

import Type from '../actions/type'
import CoreActions from '../../core/actions/creator'
import UserActions from '../actions/creator'
import { translate } from '../../core/config/lang'


export default (api) => {
	function* registerAttempt(action) {
		const { user } = action

		try {
			const response = yield call(api.register, user)

			if (response && response.ok && response.data && response.data.status === 'success'
				&& response.data.data && response.data.data.token) {
				yield put(UserActions.registerSuccess(response.data.data.token))
			} else {
				const problem = 'Registration failed.'
				const errors = (response && response.data && response.data.data) || null
				yield put(UserActions.registerFailure(yield translate(problem), errors))
			}
		} catch (err) {
			yield put(UserActions.registerFailure(err, null))
		}
	}

	function* registerSuccess(action) {
		const { token } = action
		yield put(UserActions.loginSuccess(token))
	}

	function* registerFailure(action) {
		const { errorCode } = action
		yield put(CoreActions.setNotification('danger', yield translate(errorCode)))
	}


	function* validateRegistrationNumberAttempt(action) {
		const { user } = action

		try {
			const response = yield call(api.validateRegistrationNumber, user)

			if (response && response.ok && response.data && response.data.status === 'success') {
				yield put(UserActions.validateRegistrationNumberSuccess(user))
				yield call(() => NavigationActions.SignUpProfile())
			} else {
				const problem = (response && response.data && response.data.message)
					|| 'Registration number is not valid.'
				const errors = (response && response.data && response.data.data) || null

				if (errors == null) {
					yield call(() => NavigationActions.ErrorModal({
						heading: yield translate('Sorry, we can\'t find your details'),
						message: yield translate('If you don\'t have Pearson registration number contact your employer or training provider and ask them for one.'),
						buttonLabel: yield translate('Retry'),
					}))
				}

				yield put(UserActions.validateRegistrationNumberFailure(yield translate(problem), errors))
			}
		} catch (err) {
			yield put(UserActions.validateRegistrationNumberFailure(err, null))
		}
	}

	function* validateRegistrationNumberFailure(action) {
		const { errorCode } = action
		yield put(CoreActions.setNotification('danger', yield translate(errorCode)))
	}


	function* registerProfileAttempt(action) {
		const { user: { member_id, ...user } } = action

		try {
			const response = yield call(api.updateUser, member_id, user)

			if (response && response.ok && response.data && response.data.status === 'success' && response.data.data) {
				// NOTE update user token
				const { token } = response.data.data
				if (token) {
					yield put(UserActions.loginSuccess(token))
				}
				yield put(UserActions.registerProfileSuccess(response.data.data))
				yield put(CoreActions.setCurrentTab('App'))
			} else {
				// const problem = (response && response.data && response.data.message) || 'Account activation failed.';
				const problem = 'Account activation failed.'
				const errors = (response && response.data && response.data.data) || null

				yield put(UserActions.registerProfileFailure(yield translate(problem), errors))
			}
		} catch (err) {
			yield put(UserActions.registerProfileFailure(err, null))
		}
	}

	function* registerProfileFailure(action) {
		const { errorCode } = action
		yield put(CoreActions.setNotification('danger', yield translate(errorCode)))
	}


	// The Main Watcher function
	function* startWatchers() {
		yield fork(takeEvery, Type.REGISTER_ATTEMPT, registerAttempt)
		yield fork(takeEvery, Type.REGISTER_SUCCESS, registerSuccess)
		yield fork(takeEvery, Type.REGISTER_FAILURE, registerFailure)
		yield fork(takeEvery, Type.VALIDATE_REGISTRATION_NUMBER_ATTEMPT, validateRegistrationNumberAttempt)
		yield fork(takeEvery, Type.VALIDATE_REGISTRATION_NUMBER_FAILURE, validateRegistrationNumberFailure)
		yield fork(takeEvery, Type.REGISTER_PROFILE_ATTEMPT, registerProfileAttempt)
		yield fork(takeEvery, Type.REGISTER_PROFILE_FAILURE, registerProfileFailure)
	}

	return {
		startWatchers,
	}
}
