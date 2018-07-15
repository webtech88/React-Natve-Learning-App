// import R from 'ramda'
// import { delay } from 'redux-saga'
import { takeEvery, put, call, fork, select } from 'redux-saga/effects'
// import { Actions as NavigationActions, ActionConst as NavigationType } from 'react-native-router-flux'

import Type from '../actions/type'
// import CoreActions from '../../core/actions/creator'
import WorkbookActions from '../actions/creator'
import { translate } from '../../core/config/lang'

const getUserId = state => state.user.data && state.user.data.member_id


export default (api) => {
	function* getQualificationsAttempt({ sectorId }) {
		const userId = yield select(getUserId)

		try {
			const response = yield call(api.getQualifications, userId, sectorId)

			if (response.ok && response.data && response.data.status === 'success' && response.data.data) {
				yield put(WorkbookActions.getQualificationsSuccess(response.data.data))
			} else {
				const problem = (response.data && response.data.message) || 'No qualifications yet'
				yield put(WorkbookActions.getQualificationsFailure(yield translate(problem)))
			}
		} catch (err) {
			yield put(WorkbookActions.getQualificationsFailure(err))
		}
	}

	// function* getQualificationsSuccess(action) {
	//
	// }

	// function* getQualificationsFailure(action) {
	// 	const { errorCode } = action;
	// 	yield put(CoreActions.setNotification('danger', errorCode))
	// }

	// The Main Watcher function
	function* startWatchers() {
		yield fork(takeEvery, Type.GET_QUALIFICATIONS_ATTEMPT, getQualificationsAttempt)
		// yield fork(takeEvery, Type.GET_QUALIFICATIONS_SUCCESS, getQualificationsSuccess)
		// yield fork(takeEvery, Type.GET_QUALIFICATIONS_FAILURE, getQualificationsFailure)
	}

	return {
		startWatchers,
	}
}
