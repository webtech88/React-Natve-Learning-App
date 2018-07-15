import { delay } from 'redux-saga'
import { takeEvery, put, call, fork, select, all } from 'redux-saga/effects'

import { Actions as NavigationActions } from 'react-native-router-flux'
import Type from '../actions/type'
import CoreActions from '../../core/actions/creator'
import CommunityActions from '../actions/creator'
import { translate } from '../../core/config/lang'

const getUserId = state => state.user.data && state.user.data.member_id

const checkResponse = response =>
	response.ok && response.data && response.data.status === 'success' && response.data.data

export default (api) => {
	function* getContactsAttempt(action) {
		const { centreId } = action

		try {
			/* const [contactsResponse, centreContactsResponse] = yield all([
				call(api.getContacts),
				call(api.getCentreContacts, centreId),
			])

			if (checkResponse(contactsResponse) && checkResponse(centreContactsResponse)) {
				yield put(CommunityActions.getContactsSuccess(
					contactsResponse.data.data,
					centreContactsResponse.data.data.community,
				))*/

			const centreContactsResponse = yield call(api.getCentreContacts, centreId)

			if (checkResponse(centreContactsResponse)) {
				yield put(CommunityActions.getContactsSuccess(
					[],
					centreContactsResponse.data.data.members,
				))
			} else {
				yield put(CommunityActions.getContactsFailure(yield translate('No connections yet')))
			}
		} catch (err) {
			yield put(CommunityActions.getContactsFailure(err))
		}
	}

	function* getContactsFailure(action) {
		const { errorCode } = action
		put(CoreActions.setNotification('danger', yield translate(errorCode)))
	}

	function* updateCommunitySettingsAttempt(action) {
		// NOTE Fake some network time
		yield delay(1000)

		const { settingsView, settingsType } = action
		yield put(CommunityActions.updateCommunitySettingsSuccess(settingsView, settingsType))
	}

	function* searchCommunityAttempt(action) {
		const { phrase } = action
		try {
			const response = yield call(api.searchCommunity, phrase)

			if (response.ok && response.data &&
				response.data.status === 'success' && response.data.data) {
				yield put(CommunityActions.searchCommunitySuccess(response.data.data))
			} else {
				yield put(CommunityActions.searchCommunityFailure(yield translate('No results.')))
			}
		} catch (err) {
			yield put(CommunityActions.searchCommunityFailure(err))
		}
	}

	// Manage Connection
	function* setActiveConnectionId() {
		yield call(() => NavigationActions.ConnectionInfo())
	}

	function* manageConnectionAttempt(action) {
		const userId = yield select(getUserId)
		const { memberId, connectionAction } = action

		try {
			const response = yield call(api.manageConnection, userId, memberId, connectionAction)

			if (response.ok && response.data && response.data.status === 'success') {
				const message = response.data.message || 'Success'
				yield put(CommunityActions.manageConnectionSuccess(memberId, connectionAction, yield translate(message)))
			} else {
				const problem = (response.data && response.data.message) || 'Something went wrong, please try again'
				yield put(CommunityActions.manageConnectionFailure(memberId, connectionAction, yield translate(problem)))
			}
		} catch (err) {
			yield put(CommunityActions.manageConnectionFailure(memberId, connectionAction, err))
		}
	}

	// The Main Watcher function
	function* startWatchers() {
		yield fork(takeEvery, Type.GET_CONTACTS_ATTEMPT, getContactsAttempt)
		yield fork(takeEvery, Type.GET_CONTACTS_FAILURE, getContactsFailure)
		yield fork(takeEvery, Type.UPDATE_COMMUNITY_SETTINGS_ATTEMPT, updateCommunitySettingsAttempt)
		yield fork(takeEvery, Type.SEARCH_COMMUNITY_ATTEMPT, searchCommunityAttempt)
		yield fork(takeEvery, Type.SET_ACTIVE_CONNECTION_ID, setActiveConnectionId)
		yield fork(takeEvery, Type.MANAGE_CONNECTION_ATTEMPT, manageConnectionAttempt)
	}

	return {
		startWatchers,
	}
}
