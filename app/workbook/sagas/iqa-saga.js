import R from 'ramda'
import { delay } from 'redux-saga'
import { take, takeEvery, put, call, cancel, fork, select } from 'redux-saga/effects'

import Type from '../actions/type'
import CoreActions from '../../core/actions/creator'
import WorkbookActions from '../actions/creator'
import { translate } from '../../core/config/lang'

const getIqaWorkbooks = state => state.iqa.workbooks


export default (api) => {
	function* getIqaWorkbooksAttempt() {
		try {
			const response = yield call(api.getIqaWorkbooks)

			if (response && response.ok && response.data && response.data.status === 'success' && response.data.data) {
				const workbooks = response.data.data.workbooks || []

				// if (__DEV__ && workbooks) {
				// 	workbooks = R.take(50, workbooks)
				// }


				yield put(WorkbookActions.getIqaWorkbooksSuccess(workbooks, yield translate('Workbooks loaded.')))
			} else {
				yield put(WorkbookActions.getIqaWorkbooksFailure(yield translate('System error. Please try again later.')))
			}
		} catch (err) {
			yield put(WorkbookActions.getIqaWorkbooksFailure(yield translate('System error. Please try again later.')))
		}
	}

	function* getIqaWorkbooksSuccess(action) {
		const { message } = action
		yield put(CoreActions.setNotification('success', yield translate(message)))
	}

	function* getIqaWorkbooksFailure(action) {
		const { errorCode } = action
		yield put(CoreActions.setNotification('danger', yield translate(errorCode)))
	}


	function* getIqaWorkbookAttempt(action) {
		const { unit_id, workbook_id } = action

		try {
			const response = yield call(api.getIqaWorkbook, unit_id, workbook_id)

			if (response && response.ok && response.data && response.data.status === 'success' && response.data.data) {
				const workbook = response.data.data.workbook || null
				const activities = response.data.data.activities || null
				const message = 'Workbook loaded.'

				yield put(WorkbookActions.getIqaWorkbookSuccess(workbook, activities, yield translate(message)))
			} else {
				yield put(WorkbookActions.getIqaWorkbookFailure(yield translate('System error. Please try again later.')))
			}
		} catch (err) {
			yield put(WorkbookActions.getIqaWorkbookFailure(err))
		}
	}

	function* getIqaWorkbookSuccess(action) {
		const { message } = action
		yield put(CoreActions.setNotification('success', yield translate(message)))
	}

	function* getIqaWorkbookFailure(action) {
		const { errorCode } = action
		yield put(CoreActions.setNotification('danger', yield translate(errorCode)))
	}


	function* getIqaWorkbookActivityAttempt(action) {
		const { unit_id, workbook_id, activity_code } = action

		try {
			const response = yield call(api.getIqaWorkbookActivity, unit_id, workbook_id, activity_code)

			if (response && response.ok && response.data && response.data.status === 'success'
				&& response.data.data && response.data.data.activity) {
				const activity = response.data.data.activity
				const message = 'Activity loaded.'

				yield put(WorkbookActions.getIqaWorkbookActivitySuccess(activity, yield translate(message)))
			} else {
				yield put(WorkbookActions.getIqaWorkbookActivityFailure(yield translate('Activity not available.')))
			}
		} catch (err) {
			yield put(WorkbookActions.getIqaWorkbookActivityFailure(err))
		}
	}

	function* getIqaWorkbookActivitySuccess(action) {
		const { message } = action
		yield put(CoreActions.setNotification('success', yield translate(message)))
	}

	function* getIqaWorkbookActivityFailure(action) {
		const { errorCode } = action
		yield put(CoreActions.setNotification('danger', yield translate(errorCode)))
	}


	function* filterIqaWorkbooksAttempt(action) {
		const { query } = action
		const includes = str => str.includes(query.toLowerCase())
		const workbooks = yield select(getIqaWorkbooks)
		let filteredWorkbooks = []

		if (query && workbooks) {
			filteredWorkbooks = R.filter(
				R.pipe(
					R.props(['unit_id', 'workbook_id', 'workbook_reference', 'reference', 'title']),
					R.any(R.pipe(R.toString, R.toLower, includes)),
				),
			)(workbooks)
		}

		yield put(WorkbookActions.filterIqaWorkbooksSuccess(filteredWorkbooks))
	}

	function* updateIqaWorkbooksSettingsAttempt(action) {
		// NOTE Fake some network time
		yield delay(1000) // doesn't work without delay

		const { settingsSortBy, settingsOrder } = action
		yield put(WorkbookActions.updateIqaWorkbooksSettingsSuccess(settingsSortBy, settingsOrder))
	}

	// The Main Watcher function
	function* startWatchers() {
		yield fork(takeEvery, Type.GET_IQA_WORKBOOKS_ATTEMPT, getIqaWorkbooksAttempt)
		yield fork(takeEvery, Type.GET_IQA_WORKBOOKS_SUCCESS, getIqaWorkbooksSuccess)
		yield fork(takeEvery, Type.GET_IQA_WORKBOOKS_FAILURE, getIqaWorkbooksFailure)

		// NOTE attempt does not use takeEvery
		yield fork(takeEvery, Type.GET_IQA_WORKBOOK_ATTEMPT, getIqaWorkbookAttempt)
		yield fork(takeEvery, Type.GET_IQA_WORKBOOK_SUCCESS, getIqaWorkbookSuccess)
		yield fork(takeEvery, Type.GET_IQA_WORKBOOK_FAILURE, getIqaWorkbookFailure)

		yield fork(takeEvery, Type.GET_IQA_WORKBOOK_ACTIVITY_ATTEMPT, getIqaWorkbookActivityAttempt)
		yield fork(takeEvery, Type.GET_IQA_WORKBOOK_ACTIVITY_SUCCESS, getIqaWorkbookActivitySuccess)
		yield fork(takeEvery, Type.GET_IQA_WORKBOOK_ACTIVITY_FAILURE, getIqaWorkbookActivityFailure)

		yield fork(takeEvery, Type.FILTER_IQA_WORKBOOKS_ATTEMPT, filterIqaWorkbooksAttempt)
		yield fork(takeEvery, Type.UPDATE_IQA_WORKBOOKS_SETTINGS_ATTEMPT, updateIqaWorkbooksSettingsAttempt)

		// TODO cancel task
		// while (true) {
		// 	// start workbook attempt
		// 	const action = yield take(Type.GET_IQA_WORKBOOK_ATTEMPT)
		// 	const getIqaWorkbook = yield fork(getIqaWorkbookAttempt, action)
		//
		// 	// wait for the user to pop the screen
		// 	yield take(Type.UNSET_WORKBOOK)
		// 	// user pops the screen, cancel workbook attempt task
		// 	yield cancel(getIqaWorkbook)
		// }
	}

	return {
		startWatchers,
	}
}
