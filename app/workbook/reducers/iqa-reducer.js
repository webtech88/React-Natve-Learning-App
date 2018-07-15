import Immutable from 'seamless-immutable'
import { createReducer } from 'reduxsauce'

import Type from '../actions/type'
import CoreActionsType from '../../core/actions/type'
import common from '../../common'

const { sortObjects } = common.util.helpers

export const INITIAL_STATE = Immutable({
	gettingWorkbooks: false,
	workbooks: null,
	filterQuery: '',
	filterWorkbooks: null,
	updatingSettings: false,
	settingsSortBy: 'modified',
	settingsOrder: 'desc',
	errorCode: null,
})

const getIqaWorkbooksAttempt = state => state.merge({ gettingWorkbooks: true, errorCode: null })

const getIqaWorkbooksSuccess = (state, action) => {
	const { workbooks } = action
	let updatedWorkbooks = []

	// NOTE have to get rid of content otherwise sort is too slow
	workbooks.every((workbook) => {
		updatedWorkbooks = [
			...updatedWorkbooks,
			{
				unit_id: workbook.unit_id,
				title: workbook.title,
				reference: workbook.reference,
				workbook_id: workbook.workbook_id,
				workbook_reference: workbook.workbook_reference,
				cover: workbook.cover,
				created: workbook.created,
				created_by: workbook.created_by,
				modified: workbook.modified,
				modified_by: workbook.modified_by,
			},
		]

		return workbook
	})

	if (updatedWorkbooks) {
		updatedWorkbooks = sortObjects(Immutable.asMutable(updatedWorkbooks), state.settingsSortBy, state.settingsOrder)
	}

	return state.merge({ gettingWorkbooks: false, workbooks: updatedWorkbooks, errorCode: null })
}

const getIqaWorkbooksFailure = (state, action) => {
	const { errorCode } = action
	return state.merge({ gettingWorkbooks: false, errorCode })
}


const filterIqaWorkbooksAttempt = (state, action) => {
	const { query } = action
	return state.merge({ filterQuery: query })
}

const filterIqaWorkbooksSuccess = (state, action) => {
	const { workbooks } = action
	return state.merge({ filterWorkbooks: workbooks })
}

const updateIqaWorkbooksSettingsAttempt = state => state.merge({ updatingSettings: true, errorCode: null })

const updateIqaWorkbooksSettingsSuccess = (state, action) => {
	const { settingsSortBy, settingsOrder } = action
	let workbooks = state.workbooks
	let filterWorkbooks = state.filterWorkbooks

	if (workbooks) {
		workbooks = sortObjects(Immutable.asMutable(workbooks), settingsSortBy, settingsOrder)
	}

	if (filterWorkbooks) {
		filterWorkbooks = sortObjects(Immutable.asMutable(filterWorkbooks), settingsSortBy, settingsOrder)
	}

	return state.merge({
		updatingSettings: false,
		workbooks,
		filterWorkbooks,
		settingsSortBy,
		settingsOrder,
		errorCode: null,
	})
}

// Reset
const reset = () => INITIAL_STATE


// map our types to our handlers
const ACTION_HANDLERS = {
	[Type.GET_IQA_WORKBOOKS_ATTEMPT]: getIqaWorkbooksAttempt,
	[Type.GET_IQA_WORKBOOKS_SUCCESS]: getIqaWorkbooksSuccess,
	[Type.GET_IQA_WORKBOOKS_FAILURE]: getIqaWorkbooksFailure,
	[Type.FILTER_IQA_WORKBOOKS_ATTEMPT]: filterIqaWorkbooksAttempt,
	[Type.FILTER_IQA_WORKBOOKS_SUCCESS]: filterIqaWorkbooksSuccess,
	[Type.UPDATE_IQA_WORKBOOKS_SETTINGS_ATTEMPT]: updateIqaWorkbooksSettingsAttempt,
	[Type.UPDATE_IQA_WORKBOOKS_SETTINGS_SUCCESS]: updateIqaWorkbooksSettingsSuccess,
	// Reset
	[CoreActionsType.APP_RESET_ATTEMPT]: reset,
}

export default createReducer(INITIAL_STATE, ACTION_HANDLERS)
