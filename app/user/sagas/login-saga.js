import { takeEvery, put, call, fork } from 'redux-saga/effects'
import {
  LoginManager,
  AccessToken,
} from 'react-native-fbsdk'

import Type from '../actions/type'
import CoreActions from '../../core/actions/creator'
import UserActions from '../actions/creator'
import { translate } from '../../core/config/lang'


export default (api) => {
	function* loginWithEmailAttempt(action) {
		const { user } = action

		try {
			const response = yield call(api.login, user)
console.log(response);
			if (response && response.ok && response.data && response.data.status === 'success'
				&& response.data.data && response.data.data.token) {
				console.log('Token: ', response.data.data.token)
				yield put(UserActions.loginSuccess(response.data.data.token))
			} else {
				const problem = (response && response.data && response.data.data && response.data.data.general)
					|| 'Email and Password do not match.'
				yield put(UserActions.loginFailure(problem))
			}
		} catch (err) {
			yield put(UserActions.loginFailure(err))
		}
	}

	function* loginWithFacebookAttempt() {
		const scope = 'public_profile,email'
		const permissions = scope.split(',')

		try {
			const loginResult = yield LoginManager.logInWithReadPermissions(permissions)

			if (loginResult.isCancelled) {
				yield put(UserActions.loginFailure('Login canceled by user.'))
			} else {
				const FBAccessToken = yield AccessToken.getCurrentAccessToken()

				if (!FBAccessToken) {
					yield put(UserActions.loginFailure('No access token.'))
				} else {
					const response = yield call(api.loginWithFacebook, FBAccessToken.accessToken)

					if (response && response.ok && response.data && response.data.status === 'success'
						&& response.data.data && response.data.data.token) {
						yield put(UserActions.loginSuccess(response.data.data.token))
					} else {
						const problem = (response && response.data && response.data.data && response.data.data.general)
							|| 'Email and Password do not match.'
						yield put(UserActions.loginFailure(problem))
					}
				}
			}
		} catch (err) {
			yield put(UserActions.loginFailure(err))
		}
	}

	function* loginSuccess(action) {
		const { token } = action

		if (!token) {
			throw new Error('No token provided by server.')
		}

		api.setAuthToken(token)

		yield put(UserActions.getUserAttempt(true))
	}

	function* loginFailure(action) {
		const { errorCode } = action
		yield put(CoreActions.setNotification('danger', yield translate(errorCode)))
	}

	// The Main Watcher function
	function* startWatchers() {
		yield fork(takeEvery, Type.LOGIN_WITH_EMAIL_ATTEMPT, loginWithEmailAttempt)
		yield fork(takeEvery, Type.LOGIN_WITH_FACEBOOK_ATTEMPT, loginWithFacebookAttempt)
		yield fork(takeEvery, Type.LOGIN_SUCCESS, loginSuccess)
		yield fork(takeEvery, Type.LOGIN_FAILURE, loginFailure)
	}

	return {
		startWatchers,
	}
}
