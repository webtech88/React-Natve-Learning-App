import Immutable from 'seamless-immutable'
import { createReducer } from 'reduxsauce'

import Type from '../actions/type'
import CoreActionsType from '../../core/actions/type'

export const INITIAL_STATE = Immutable({
	gettingQualifications: false,
	data: null,
	currentQualificationId: null, // NOTE used for qualifications swiper index
	activeQualificationId: null, // NOTE used for navigation animations
	searchQuery: '',
	errorCode: null,
})


const getQualificationsAttempt = state => state.merge({ gettingQualifications: true, errorCode: null })

const getQualificationsSuccess = (state, { qualifications }) => {
	let { currentQualificationId } = state

	const data = qualifications.reduce((acc, cur) => {
		acc[`${cur.qualification_id}`] = cur

		if (!currentQualificationId && cur.is_current) {
			currentQualificationId = cur.qualification_id
		}

		return acc
	}, {})

	if (!currentQualificationId) {
		currentQualificationId = Number(Object.keys(data)[0])
	}

	return state.merge({ gettingQualifications: false, data, currentQualificationId, errorCode: null })
}

const getQualificationsFailure = (state, { errorCode }) => state.merge({ gettingQualifications: false, errorCode })

const setActiveQualificationId = (state, { qualificationId }) => state.merge({ activeQualificationId: qualificationId })

const setCurrentQualificationId = (state, { qualificationId }) => state.set('currentQualificationId', qualificationId)

const unsetActiveQualificationId = state => state.merge({ activeQualificationId: null })

const setWorkbooksSearchQuery = (state, { query }) => Immutable.set(state, 'searchQuery', query)

// Reset
const reset = () => INITIAL_STATE


// map our types to our handlers
const ACTION_HANDLERS = {
	[Type.GET_QUALIFICATIONS_ATTEMPT]: getQualificationsAttempt,
	[Type.GET_QUALIFICATIONS_SUCCESS]: getQualificationsSuccess,
	[Type.GET_QUALIFICATIONS_FAILURE]: getQualificationsFailure,
	[Type.SET_ACTIVE_QUALIFICATION_ID]: setActiveQualificationId,
	[Type.SET_CURRENT_QUALIFICATION_ID]: setCurrentQualificationId,
	[Type.UNSET_ACTIVE_QUALIFICATION_ID]: unsetActiveQualificationId,
	[Type.SET_WORKBOOKS_SEARCH_QUERY]: setWorkbooksSearchQuery,
	// Reset
	[CoreActionsType.APP_RESET_ATTEMPT]: reset,
}

export default createReducer(INITIAL_STATE, ACTION_HANDLERS)
