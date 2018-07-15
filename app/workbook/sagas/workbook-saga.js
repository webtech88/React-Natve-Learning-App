import { take, takeEvery, put, fork, call, cancel } from 'redux-saga/effects'

import Type from '../actions/type'
import CoreActions from '../../core/actions/creator'
import WorkbookActions from '../actions/creator'
import { translate } from '../../core/config/lang'


export default (api) => {
	function* getWorkbookAttempt(action) {
		const { member_id, workbook_id } = action

		try {
			const response = yield call(api.getWorkbook, member_id, workbook_id)

			if (response && response.ok && response.data && response.data.status === 'success' && response.data.data) {
				const workbook = response.data.data.workbook || null
				const activities = response.data.data.activities || null
				const message = 'Workbook loaded.'

				yield put(WorkbookActions.getWorkbookSuccess(workbook, activities, yield translate(message)))
			} else {
				yield put(WorkbookActions.getWorkbookFailure(yield translate('System error. Please try again later.')))
			}
		} catch (err) {
			yield put(WorkbookActions.getWorkbookFailure(err))
		}
	}

	function* getWorkbookSuccess(action) {
		const { message } = action
		yield put(CoreActions.setNotification('success', yield translate(message)))
	}

	function* getWorkbookFailure(action) {
		const { errorCode } = action
		yield put(CoreActions.setNotification('danger', yield translate(errorCode)))
	}


	function* getWorkbookActivityAttempt(action) {
		const { member_id, activity_id } = action

		try {
			const response = yield call(api.getWorkbookActivity, member_id, activity_id)

			if (response && response.ok && response.data && response.data.status === 'success'
				&& response.data.data && response.data.data.activity && response.data.data.solution) {
				const activity = response.data.data.activity
				const solution = response.data.data.solution
				const message = 'Activity loaded.'

				yield put(WorkbookActions.getWorkbookActivitySuccess(activity, yield translate(solution), yield translate(message)))
			} else {
				yield put(WorkbookActions.getWorkbookActivityFailure(yield translate('Activity not available.')))
			}
		} catch (err) {
			yield put(WorkbookActions.getWorkbookActivityFailure(err))
		}
	}

	function* getWorkbookActivitySuccess(action) {
		const { message } = action
		yield put(CoreActions.setNotification('success', yield translate(message)))
	}

	function* getWorkbookActivityFailure(action) {
		const { errorCode } = action
		yield put(CoreActions.setNotification('danger', yield translate(errorCode)))
	}

	function* saveWorkbookActivityAttempt(action) {
		const { activity_id, evidence, submit } = action

		try {
			const response = yield call(api.saveWorkbookActivity, activity_id, {
				evidence: JSON.stringify(evidence),
				submitted: submit || 0,
			})

			if (response && response.ok && response.data && response.data.status === 'success'
				&& response.data.data && response.data.data.activity && response.data.data.solution) {
				const activity = response.data.data.activity
				const solution = response.data.data.solution
				const message = submit ? 'Activity submitted.' : 'Activity saved.'

				yield put(WorkbookActions.saveWorkbookActivitySuccess(activity, solution, yield translate(message), submit))
			} else {
				const problem = response.data.message || 'Activity submission failed.'
				yield put(WorkbookActions.saveWorkbookActivityFailure(yield translate(problem), submit))
			}
		} catch (err) {
			yield put(WorkbookActions.saveWorkbookActivityFailure(err, submit))
		}
	}

	function* saveWorkbookActivitySuccess(action) {
		const { message } = action
		yield put(CoreActions.setNotification('success', yield translate(message)))
	}

	function* saveWorkbookActivityFailure(action) {
		const { errorCode } = action
		yield put(CoreActions.setNotification('danger', yield translate(errorCode)))
	}

	// The Main Watcher function
	function* startWatchers() {
		// NOTE attempt does not use takeEvery
		yield fork(takeEvery, Type.GET_WORKBOOK_ATTEMPT, getWorkbookAttempt)
		yield fork(takeEvery, Type.GET_WORKBOOK_SUCCESS, getWorkbookSuccess)
		yield fork(takeEvery, Type.GET_WORKBOOK_FAILURE, getWorkbookFailure)

		yield fork(takeEvery, Type.GET_WORKBOOK_ACTIVITY_ATTEMPT, getWorkbookActivityAttempt)
		yield fork(takeEvery, Type.GET_WORKBOOK_ACTIVITY_SUCCESS, getWorkbookActivitySuccess)
		yield fork(takeEvery, Type.GET_WORKBOOK_ACTIVITY_FAILURE, getWorkbookActivityFailure)

		yield fork(takeEvery, Type.SAVE_WORKBOOK_ACTIVITY_ATTEMPT, saveWorkbookActivityAttempt)
		yield fork(takeEvery, Type.SAVE_WORKBOOK_ACTIVITY_SUCCESS, saveWorkbookActivitySuccess)
		yield fork(takeEvery, Type.SAVE_WORKBOOK_ACTIVITY_FAILURE, saveWorkbookActivityFailure)

		// TODO cancel task
		// while (true) {
		// 	// start workbook attempt
		// 	const action = yield take(Type.GET_WORKBOOK_ATTEMPT)
		// 	const getWorkbook = yield fork(getWorkbookAttempt, action)
		// 	console.log(action)
		// 	// wait for the user to pop the screen
		// 	yield take(Type.UNSET_WORKBOOK)
		// 	// user pops the screen, cancel workbook attempt task
		// 	yield cancel(getWorkbook)
		// }
	}

	return {
		startWatchers,
	}
}
