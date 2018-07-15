import Immutable from 'seamless-immutable'
import R from 'ramda'
import { createReducer } from 'reduxsauce'

import Type from '../actions/type'
import CoreActionsType from '../../core/actions/type'

const INITIAL_MANAGE_CONNECTION_STATE = {
	action: null, // one of: request, cancel, accept, decline
	attempting: false,
	success: null,
	error: null,
}

export const INITIAL_STATE = Immutable({
	gettingContacts: false,
	updatingSettings: false,
	settingsView: 'cards', // cards or list
	settingsType: 'all', // TODO all or students or tutors or brands
	data: null,
	errorCode: null,
	searchResults: [],
	activeConnectionId: null,
	manageConnections: {},
})

const getUpdatedConnectionStatus = (action) => {
	let status

	switch (action) {
	case 'request':
		status = 'pending'
		break
	case 'accept':
		status = 'friend'
		break
	case 'cancel':
	case 'decline':
	default:
		status = 'unrelated'
		break
	}

	return status
}

const setManageConnectionState = (state, memberId, connection) =>
	Immutable.setIn(state, ['manageConnections', memberId], Object.assign(
		{}, INITIAL_MANAGE_CONNECTION_STATE, connection,
	))

const getContactsAttempt = state => state.merge({ gettingContacts: true, errorCode: null })

const getContactsSuccess = (state, action) => {
	const { contacts: { friends, pending, invites }, centreContacts } = action

	// merge
	const newContacts = [] // R.map(n => ({ ...n, status: 'pending' }), pending).concat(
	// 	R.map(n => ({ ...n, status: 'invite' }), invites),
	// 	R.map(n => ({ ...n, status: 'friend' }), friends),
	// )

	const newCentreContacts = centreContacts.map(contact => ({ ...contact, status: 'friend' }))

	return state.merge({ gettingContacts: false, data: newCentreContacts.concat(newContacts), errorCode: null })
}

const getContactsFailure = (state, action) => {
	const { errorCode } = action

	return state.merge({ gettingContacts: false, data: [], errorCode })
}

const updateCommunitySettingsAttempt = state => state.merge({ updatingSettings: true, errorCode: null })

const updateCommunitySettingsSuccess = (state, action) => {
	const { settingsView, settingsType } = action

	return state.merge({ updatingSettings: false, settingsView, settingsType, errorCode: null })
}

const searchCommunitySuccess = (state, action) => {
	// TODO blocked
	const { results: { friends, pending, invites, unrelated } } = action

	// merge
	const newResults = R.map(n => ({ ...n, status: 'pending' }), pending).concat(
		R.map(n => ({ ...n, status: 'invite' }), invites),
		R.map(n => ({ ...n, status: 'friend' }), friends),
		R.map(n => ({ ...n, status: 'unrelated' }), unrelated),
	)

	// map online
	// newResults = newResults.map(contact => ({
	// 	...contact,
	// 	online: contact.online_seconds_ago <= 180, // 3 minutes period for online check
	// }))

	return state.merge({ searchResults: newResults })
}

const clearCommunitySearch = state => state.merge({ searchResults: [] })


const setActiveConnectionId = (state, { memberId }) => state.set('activeConnectionId', memberId)
const unsetActiveConnectionId = state => state.set('activeConnectionId', null)

const manageConnectionAttempt = (state, action) => {
	const { memberId, connectionAction } = action
	return setManageConnectionState(state, memberId, { action: connectionAction, attempting: true })
}

const manageConnectionSuccess = (state, action) => {
	const { memberId, connectionAction, success } = action
	const updatedStatus = getUpdatedConnectionStatus(connectionAction)
	let updatedState = state

	// TODO release 2 ???
	// add or remove connection to data (unrelated: remove, related: add)
	// const connectionIndexInData = updatedState.data.findIndex(connection => connection.member_id === memberId)
	// if (updatedStatus === 'unrelated') {
	// 	// remove from data if present
	// 	const updatedData = Immutable.without(updatedState.data, connectionIndexInData)
	// 	updatedState = Immutable.set(updatedState, 'data', updatedData)
	// } else {
	// 	// add to data if not present
	// 	console.log('related', connectionIndexInData)
	// }

	// update connections
	if (updatedState.data) {
		const dataIndex = updatedState.data.findIndex(connection => connection.member_id === memberId)
		if (dataIndex !== -1) {
			updatedState = Immutable.setIn(updatedState, ['data', dataIndex, 'status'], updatedStatus)
		}
	}

	// update search results
	if (updatedState.searchResults) {
		const searchIndex = updatedState.searchResults.findIndex(connection => connection.member_id === memberId)
		if (searchIndex !== -1) {
			updatedState = Immutable.setIn(updatedState, ['searchResults', searchIndex, 'status'], updatedStatus)
		}
	}

	return setManageConnectionState(updatedState, memberId, { action: connectionAction, success })
}

const manageConnectionFailure = (state, action) => {
	const { memberId, connectionAction, error } = action
	return setManageConnectionState(state, memberId, { action: connectionAction, error })
}


// Reset
const reset = () => INITIAL_STATE


// map our types to our handlers
const ACTION_HANDLERS = {
	[Type.GET_CONTACTS_ATTEMPT]: getContactsAttempt,
	[Type.GET_CONTACTS_SUCCESS]: getContactsSuccess,
	[Type.GET_CONTACTS_FAILURE]: getContactsFailure,
	[Type.UPDATE_COMMUNITY_SETTINGS_ATTEMPT]: updateCommunitySettingsAttempt,
	[Type.UPDATE_COMMUNITY_SETTINGS_SUCCESS]: updateCommunitySettingsSuccess,
	[Type.SEARCH_COMMUNITY_SUCCESS]: searchCommunitySuccess,
	[Type.CLEAR_COMMUNITY_SEARCH]: clearCommunitySearch,
	[Type.SET_ACTIVE_CONNECTION_ID]: setActiveConnectionId,
	[Type.UNSET_ACTIVE_CONNECTION_ID]: unsetActiveConnectionId,
	[Type.MANAGE_CONNECTION_ATTEMPT]: manageConnectionAttempt,
	[Type.MANAGE_CONNECTION_SUCCESS]: manageConnectionSuccess,
	[Type.MANAGE_CONNECTION_FAILURE]: manageConnectionFailure,
	// Reset
	[CoreActionsType.APP_RESET_ATTEMPT]: reset,
}

export default createReducer(INITIAL_STATE, ACTION_HANDLERS)
