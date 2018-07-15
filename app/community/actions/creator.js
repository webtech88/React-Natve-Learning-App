import Type from './type'

// Add all actions to the return
const getContactsAttempt = centreId => ({ type: Type.GET_CONTACTS_ATTEMPT, centreId })
const getContactsSuccess = (contacts, centreContacts) =>
	({ type: Type.GET_CONTACTS_SUCCESS, contacts, centreContacts })
const getContactsFailure = errorCode => ({ type: Type.GET_CONTACTS_FAILURE, errorCode })

const updateCommunitySettingsAttempt = (settingsView, settingsType) => ({
	type: Type.UPDATE_COMMUNITY_SETTINGS_ATTEMPT, settingsView, settingsType,
})
const updateCommunitySettingsSuccess = (settingsView, settingsType) => ({
	type: Type.UPDATE_COMMUNITY_SETTINGS_SUCCESS, settingsView, settingsType,
})

const searchCommunityAttempt = phrase => ({ type: Type.SEARCH_COMMUNITY_ATTEMPT, phrase })
const searchCommunitySuccess = results => ({ type: Type.SEARCH_COMMUNITY_SUCCESS, results })
const searchCommunityFailure = errorCode => ({ type: Type.SEARCH_COMMUNITY_FAILURE, errorCode })
const clearCommunitySearch = () => ({ type: Type.CLEAR_COMMUNITY_SEARCH })

const setActiveConnectionId = memberId => ({ type: Type.SET_ACTIVE_CONNECTION_ID, memberId })
const unsetActiveConnectionId = () => ({ type: Type.UNSET_ACTIVE_CONNECTION_ID })

const manageConnectionAttempt = (memberId, connectionAction) => ({
	type: Type.MANAGE_CONNECTION_ATTEMPT, memberId, connectionAction,
})
const manageConnectionSuccess = (memberId, connectionAction, success) => ({
	type: Type.MANAGE_CONNECTION_SUCCESS, memberId, connectionAction, success,
})
const manageConnectionFailure = (memberId, connectionAction, error) => ({
	type: Type.MANAGE_CONNECTION_FAILURE, memberId, connectionAction, error,
})

// Makes available all the action creators we've created.
export default {
	getContactsAttempt,
	getContactsSuccess,
	getContactsFailure,

	updateCommunitySettingsAttempt,
	updateCommunitySettingsSuccess,

	searchCommunityAttempt,
	searchCommunitySuccess,
	searchCommunityFailure,
	clearCommunitySearch,

	setActiveConnectionId,
	unsetActiveConnectionId,
	manageConnectionAttempt,
	manageConnectionSuccess,
	manageConnectionFailure,
}
