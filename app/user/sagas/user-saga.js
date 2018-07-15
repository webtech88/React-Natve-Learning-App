import { takeEvery, put, call, fork, select } from 'redux-saga/effects'
import { Actions as NavigationActions } from 'react-native-router-flux'
import { startConfiguration, subscribe, unsubscribe } from 'pusher-redux/react-native'
import Intercom from 'react-native-intercom'
import { Crashlytics } from 'react-native-fabric'

import Type from '../actions/type'
import CoreActionsType from '../../core/actions/type'
import CoreActions from '../../core/actions/creator'
import UserActions from '../actions/creator'
import ChatActionsType from '../../chat/actions/type'
import { translate } from '../../core/config/lang'

const getToken = state => state.auth.token


export default (api) => {
	// Get User
	function* getUserAttempt(action) {
		const { auth } = action

		try {
			const response = yield call(api.getUser)

			if (response && response.ok && response.data && response.data.status === 'success' && response.data.data) {
				yield put(UserActions.getUserSuccess(response.data.data, auth))
			} else {
				const problem = (response && response.data && response.data.message)
					|| 'System error. Please try again later.'
				yield put(UserActions.getUserFailure(yield translate(problem), auth))
			}
		} catch (err) {
			yield put(UserActions.getUserFailure(err, auth))
		}
	}

	function* getUserSuccess(action) {
		const { user, auth } = action

		if (auth && user) {
			console.log('Fetched User: ', user, auth)
			const heading = yield translate('Please check your email')
			const buttonLabel = yield translate('Got it')
			if (user.unverified_email) {
				const message = (yield translate('We have sent an email to ')) +
												user.email +
												(yield translate('Please follow the link in this email to ' +
												'validate your account and complete your centre’s registration.'))
				yield put(UserActions.logout())
				yield call(() => NavigationActions.SignIn({ type: 'replace' }))
				yield call(() => NavigationActions.ErrorModal({
					heading,
					message,
					buttonLabel,
				}))
			} else if (!user.membership_completed) {
				const message = (yield translate('Please finish your membership setting on our site.'))
				yield put(UserActions.logout())
				yield call(() => NavigationActions.SignIn({ type: 'replace' }))
				yield call(() => NavigationActions.ErrorModal({
					heading,
					message,
					buttonLabel,
				}))
			} else {
				yield put(CoreActions.setCurrentTab('App'))
				yield put(CoreActions.getNotificationsAttempt())

				const token = yield select(getToken)
				const { member_id: userId, email, screen_name: screenName } = user
				if (!__DEV__) {
					Crashlytics.setUserIdentifier(userId.toString())
					Crashlytics.setUserName(screenName)
				}

				console.log('Token: ', token)


				if (token && userId) {
					startConfiguration({ // pass options
						auth: {
							headers: {
								'X-Auth': token,
							},
						},
					})

					subscribe(`private-member-${userId}`, 'friend_request', CoreActionsType.PUSHER_NOTIFICATION_RECEIVED)
					subscribe(`private-member-${userId}`, 'message', ChatActionsType.PUSHER_MESSAGE_NOTIFICATION_PENDING)
					// TODO PUSHER
					// subscribe(`private-member-${userId}`, 'tutor_assignment', CoreActionsType.PUSHER_MESSAGE_NOTIFICATION_RECEIVED)

					// Intercom
					Intercom.registerIdentifiedUser({ userId: userId.toString() })
					// TODO https://docs.intercom.com/configure-intercom-for-your-product-or-site/staying-secure/enable-identity-verification-in-intercom-for-ios
					// Intercom.setUserHash(userId hash here)
					Intercom.updateUser({
						email,
						name: screenName,
					})
				}
			}
		}
	}

	function* getUserFailure(action) {
		const { errorCode, auth } = action

		if (auth) {
			yield put(UserActions.logout())
		} else {
			yield put(CoreActions.setNotification('danger', yield translate(errorCode)))
		}
	}

	// Update User
	function* updateUserAttempt(action) {
		const { member_id, user } = action

		try {
			const response = yield call(api.updateUser, member_id, user)

			if (response && response.ok && response.data && response.data.status === 'success' && response.data.data) {
				// NOTE update user token
				const { token } = response.data.data
				if (token) {
					yield put(UserActions.loginSuccess(token))
				}
				const message = response.data.message || 'Profile updated.'
				yield put(UserActions.updateUserSuccess(response.data.data, yield translate(message)))
			} else {
				const problem = 'Profile update failed.'
				const errors = (response && response.data && response.data.data) || null
				yield put(UserActions.updateUserFailure(yield translate(problem), errors))
			}
		} catch (err) {
			yield put(UserActions.updateUserFailure(err, null))
		}
	}

	function* updateUserSuccess(action) {
		const { message } = action

		if (message) {
			yield put(CoreActions.setNotification('success', yield translate(message)))
		}
	}

	function* updateUserFailure(action) {
		const { errorCode } = action
		yield put(CoreActions.setNotification('danger', yield translate(errorCode)))
	}


	// Reset User
	function* resetUser({ userId }) {
		// NOTE pusher unsubscribe
		if (userId) {
			unsubscribe(`private-member-${userId}`, 'friend_request', CoreActionsType.PUSHER_NOTIFICATION_RECEIVED)
			unsubscribe(`private-member-${userId}`, 'message', ChatActionsType.PUSHER_MESSAGE_NOTIFICATION_PENDING)
		}
	}

	// The Main Watcher function
	function* startWatchers() {
		yield fork(takeEvery, Type.GET_USER_ATTEMPT, getUserAttempt)
		yield fork(takeEvery, Type.GET_USER_SUCCESS, getUserSuccess)
		yield fork(takeEvery, Type.GET_USER_FAILURE, getUserFailure)
		yield fork(takeEvery, Type.UPDATE_USER_ATTEMPT, updateUserAttempt)
		yield fork(takeEvery, Type.UPDATE_USER_SUCCESS, updateUserSuccess)
		yield fork(takeEvery, Type.UPDATE_USER_FAILURE, updateUserFailure)
		yield fork(takeEvery, CoreActionsType.APP_RESET_ATTEMPT, resetUser)
	}

	return {
		startWatchers,
	}
}
