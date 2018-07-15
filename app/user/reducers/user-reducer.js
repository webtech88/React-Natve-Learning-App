import Immutable from 'seamless-immutable'
import R from 'ramda'
import { createReducer } from 'reduxsauce'
import { REHYDRATE } from 'redux-persist/constants'

import { actionTypes as ReduxFormType } from 'redux-form'
import Type from '../actions/type'
import CoreActionsType from '../../core/actions/type'

export const INITIAL_STATE = Immutable({
	attemptingValidateRegistrationNumber: false,
	attemptingRegisterProfile: false,
	gettingUser: false,
	updatingUser: false,
	data: null,
	currentQualification: {},
	errorCode: null,
	errors: null,
})

const INGORED_PROPERTIES = ['current_qualification', 'centres', 'notifications_counts', 'sectors', 'unread_chats']

// Register User
const validateRegistrationNumberAttempt = state =>
	state.merge({ attemptingValidateRegistrationNumber: true, errorCode: null, errors: null })

const validateRegistrationNumberSuccess = state =>
	state.merge({ attemptingValidateRegistrationNumber: false, errorCode: null, errors: null })

const validateRegistrationNumberFailure = (state, { errorCode, errors }) =>
	state.merge({ attemptingValidateRegistrationNumber: false, errorCode, errors })

const registerProfileAttempt = state =>
	state.merge({ attemptingRegisterProfile: true, errorCode: null, errors: null })

const registerProfileSuccess = state =>
	state.merge({ attemptingRegisterProfile: false, errorCode: null, errors: null })

const registerProfileFailure = (state, { errorCode, errors }) =>
	state.merge({ attemptingRegisterProfile: false, errorCode, errors })

// Get User
const getUserAttempt = state => state.merge({ gettingUser: true, errorCode: null })

const getUserSuccess = (state, { user }) => {
	const userData = R.omit(INGORED_PROPERTIES, user)
	const data = {
		...state.data,
		...userData,
	}

	return state.merge({ ...INITIAL_STATE, data, currentQualification: user.current_qualification || {} })
}

const getUserFailure = (state, { errorCode }) => state.merge({ gettingUser: false, errorCode })

// Update User
const updateUserAttempt = state => state.merge({ updatingUser: true, errorCode: null, errors: null })

const updateUserSuccess = (state, { user }) => {
	if (user) {
		const data = {
			...state.data,
			...user,
		}

		return state.merge({ data, updatingUser: false, errorCode: null, errors: null })
	}

	return state.merge({ updatingUser: false, errorCode: null, errors: null })
}

const updateUserFailure = (state, { errorCode, errors }) => state.merge({ updatingUser: false, errorCode, errors })


// Reset
const rehydrate = (state, action) => {
	const persistedUser = action.payload.user

	if (persistedUser) {
		return persistedUser.merge({
			attemptingValidateRegistrationNumber: false,
			attemptingRegisterProfile: false,
			gettingUser: false,
			updatingUser: false,
			errorCode: null,
			errors: null,
		})
	}

	return state
}

const resetErrors = state => state.merge({ errorCode: null, errors: null })

const reset = () => INITIAL_STATE

// map our types to our handlers
const ACTION_HANDLERS = {
	// Register User
	[Type.VALIDATE_REGISTRATION_NUMBER_ATTEMPT]: validateRegistrationNumberAttempt,
	[Type.VALIDATE_REGISTRATION_NUMBER_SUCCESS]: validateRegistrationNumberSuccess,
	[Type.VALIDATE_REGISTRATION_NUMBER_SUCCESS]: getUserSuccess,
	[Type.VALIDATE_REGISTRATION_NUMBER_FAILURE]: validateRegistrationNumberFailure,
	[Type.REGISTER_PROFILE_ATTEMPT]: registerProfileAttempt,
	[Type.REGISTER_PROFILE_SUCCESS]: registerProfileSuccess,
	[Type.REGISTER_PROFILE_SUCCESS]: getUserSuccess,
	[Type.REGISTER_PROFILE_FAILURE]: registerProfileFailure,
	// User
	[Type.GET_USER_ATTEMPT]: getUserAttempt,
	[Type.GET_USER_SUCCESS]: getUserSuccess,
	[Type.GET_USER_FAILURE]: getUserFailure,
	[Type.UPDATE_USER_ATTEMPT]: updateUserAttempt,
	[Type.UPDATE_USER_SUCCESS]: updateUserSuccess,
	[Type.UPDATE_USER_FAILURE]: updateUserFailure,
	[Type.UPDATE_PASSWORD_ATTEMPT]: updateUserAttempt,
	[Type.UPDATE_PASSWORD_SUCCESS]: updateUserSuccess,
	[Type.UPDATE_PASSWORD_FAILURE]: updateUserFailure,
	// Reset
	[REHYDRATE]: rehydrate,
	[ReduxFormType.CHANGE]: resetErrors,
	[CoreActionsType.APP_RESET_ATTEMPT]: reset,
	[Type.LOGOUT]: reset,
}

export default createReducer(INITIAL_STATE, ACTION_HANDLERS)
