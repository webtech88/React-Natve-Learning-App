import Immutable from 'seamless-immutable'
import { createReducer } from 'reduxsauce'

import Type from '../actions/type'
import CoreActionsType from '../../core/actions/type'

export const INITIAL_STATE = Immutable({
	gettingWorkbook: false,
	data: null,
	activities: null,
	gettingActivity: false,
	savingActivity: false,
	submittingActivity: false,
	activity: {
		data: null,
		submitted: false,
		approved: false,
		evidence: null,
	},
	errorCode: null,
})

const setActivity = (state, activity, solution) => {
	const updatedState = state.setIn(['activity', 'data'],
		{ ...activity, content: JSON.parse(activity.content) },
	)

	if (solution) {
		const newActivity = updatedState.activity
		const updatedActivity = newActivity.merge({
			evidence: solution.evidence && solution.evidence.content
				? JSON.parse(solution.evidence.content)
				: null,
			submitted: !!solution.submitted,
			approved: !!solution.approved,
		})

		return updatedState.set('activity', updatedActivity)
	}

	return updatedState
}

const getWorkbookAttempt = state => state.merge({ gettingWorkbook: true, errorCode: null })

const getWorkbookSuccess = (state, { workbook, activities }) =>
	state.merge({ gettingWorkbook: false, data: workbook, activities })

const getWorkbookFailure = (state, { errorCode }) => state.merge({ gettingWorkbook: false, errorCode })


const getWorkbookActivityAttempt = state =>
	state.merge({ gettingActivity: true, errorCode: null })

const getWorkbookActivitySuccess = (state, { activity, solution }) => {
	const newState = state.set('gettingActivity', false)
	return setActivity(newState, activity, solution)
}

const getWorkbookActivityFailure = (state, { errorCode }) =>
	state.merge({ gettingActivity: false, errorCode })


const saveWorkbookActivityAttempt = (state, { submit }) => {
	const getting = submit ? 'submittingActivity' : 'savingActivity'
	const newState = state.set(getting, true)
	return newState.set('errorCode', null)
}

const saveWorkbookActivitySuccess = (state, { activity, solution, submit }) => {
	const getting = submit ? 'submittingActivity' : 'savingActivity'
	const newState = state.set(getting, false)
	const newStateWithActivity = setActivity(newState, activity, solution)

	// update activities
	if (submit) {
		const activitiesIndex = newStateWithActivity.activities.findIndex(a => a.activity_id === activity.activity_id)
		return Immutable.setIn(newStateWithActivity, ['activities', activitiesIndex, 'status'], 'submitted')
	}

	return newStateWithActivity
}

const saveWorkbookActivityFailure = (state, { errorCode, submit }) => {
	const getting = submit ? 'submittingActivity' : 'savingActivity'
	const newState = state.set(getting, false)
	return newState.set('errorCode', errorCode)
}


const unsetWorkbook = state => state.merge({ data: null, activities: null })
const unsetActivity = state => state.merge({ activity: INITIAL_STATE.activity })

// Reset
const reset = () => INITIAL_STATE


// map our types to our handlers
const ACTION_HANDLERS = {
	[Type.GET_WORKBOOK_ATTEMPT]: getWorkbookAttempt,
	[Type.GET_IQA_WORKBOOK_ATTEMPT]: getWorkbookAttempt,
	[Type.GET_WORKBOOK_SUCCESS]: getWorkbookSuccess,
	[Type.GET_IQA_WORKBOOK_SUCCESS]: getWorkbookSuccess,
	[Type.GET_WORKBOOK_FAILURE]: getWorkbookFailure,
	[Type.GET_IQA_WORKBOOK_FAILURE]: getWorkbookFailure,
	[Type.GET_WORKBOOK_ACTIVITY_ATTEMPT]: getWorkbookActivityAttempt,
	[Type.GET_IQA_WORKBOOK_ACTIVITY_ATTEMPT]: getWorkbookActivityAttempt,
	[Type.GET_WORKBOOK_ACTIVITY_SUCCESS]: getWorkbookActivitySuccess,
	[Type.GET_IQA_WORKBOOK_ACTIVITY_SUCCESS]: getWorkbookActivitySuccess,
	[Type.GET_WORKBOOK_ACTIVITY_FAILURE]: getWorkbookActivityFailure,
	[Type.GET_IQA_WORKBOOK_ACTIVITY_FAILURE]: getWorkbookActivityFailure,
	[Type.SAVE_WORKBOOK_ACTIVITY_ATTEMPT]: saveWorkbookActivityAttempt,
	[Type.SAVE_WORKBOOK_ACTIVITY_SUCCESS]: saveWorkbookActivitySuccess,
	[Type.SAVE_WORKBOOK_ACTIVITY_FAILURE]: saveWorkbookActivityFailure,
	[Type.UNSET_WORKBOOK]: unsetWorkbook,
	[Type.UNSET_ACTIVITY]: unsetActivity,
	// Reset
	[CoreActionsType.APP_RESET_ATTEMPT]: reset,
}

export default createReducer(INITIAL_STATE, ACTION_HANDLERS)
