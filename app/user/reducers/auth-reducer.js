import Immutable from 'seamless-immutable'
import { createReducer } from 'reduxsauce'
import { REHYDRATE } from 'redux-persist/constants'

import { actionTypes as ReduxFormType } from 'redux-form'
import Type from '../actions/type'
import CoreActionsType from '../../core/actions/type'

const INITIAL_STATE = Immutable({
	token: null,
	attemptingLoginWithEmail: false,
	attemptingLoginWithFacebook: false,
	attemptingRegister: false,
	attemptingRequestForgotPassword: false,
	attemptingVerifyPassword: false,
	errorCode: null,
	errors: null,
})

// Auth
const loginWithEmailAttempt = state => state.merge({ attemptingLoginWithEmail: true, errorCode: null })

const loginWithFacebookAttempt = state => state.merge({ attemptingLoginWithFacebook: true, errorCode: null })

const loginSuccess = (state, { token }) => state.merge({ ...INITIAL_STATE, token })

const loginFailure = (state, { errorCode }) => state.merge({ ...INITIAL_STATE, errorCode })

// Register
const registerAttempt = state => state.merge({ attemptingRegister: true, errorCode: null, errors: null })

const registerSuccess = state => state.merge({ attemptingRegister: false, errorCode: null, errors: null })

const registerFailure = (state, { errorCode, errors }) => state.merge({ ...INITIAL_STATE, errorCode, errors })

// Forgot Password
const forgotPasswordAttempt = state =>
	state.merge({ attemptingRequestForgotPassword: true, errorCode: null })

const forgotPasswordSuccess = state =>
	state.merge({ attemptingRequestForgotPassword: false, errorCode: null })

const forgotPasswordFailure = (state, { errorCode }) =>
	state.merge({ attemptingRequestForgotPassword: false, errorCode })

// Verify Password
const verifyPasswordAttempt = state => state.merge({ attemptingVerifyPassword: true, errorCode: null })

const verifyPasswordSuccess = (state, { token }) => state.merge({ ...INITIAL_STATE, token })

const verifyPasswordFailure = (state, { errorCode }) => state.merge({ attemptingVerifyPassword: false, errorCode })

// Reset
const rehydrate = (state, action) => {
	const persistedAuth = action.payload.auth

	if (persistedAuth) {
		return persistedAuth.merge({
			attemptingLoginWithEmail: false,
			attemptingLoginWithFacebook: false,
			attemptingRegister: false,
			attemptingRequestForgotPassword: false,
			attemptingVerifyPassword: false,
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
	// Auth
	[Type.LOGIN_WITH_EMAIL_ATTEMPT]: loginWithEmailAttempt,
	[Type.LOGIN_WITH_FACEBOOK_ATTEMPT]: loginWithFacebookAttempt,
	[Type.LOGIN_SUCCESS]: loginSuccess,
	[Type.LOGIN_FAILURE]: loginFailure,
	// Register
	[Type.REGISTER_ATTEMPT]: registerAttempt,
	[Type.REGISTER_SUCCESS]: registerSuccess,
	[Type.REGISTER_FAILURE]: registerFailure,
	// Forgot Password
	[Type.FORGOT_PASSWORD_ATTEMPT]: forgotPasswordAttempt,
	[Type.FORGOT_PASSWORD_SUCCESS]: forgotPasswordSuccess,
	[Type.FORGOT_PASSWORD_FAILURE]: forgotPasswordFailure,
	// Verify Password
	[Type.VERIFY_PASSWORD_ATTEMPT]: verifyPasswordAttempt,
	[Type.VERIFY_PASSWORD_SUCCESS]: verifyPasswordSuccess,
	[Type.VERIFY_PASSWORD_FAILURE]: verifyPasswordFailure,
	// Reset
	[REHYDRATE]: rehydrate,
	[ReduxFormType.CHANGE]: resetErrors,
	[CoreActionsType.APP_RESET_ATTEMPT]: reset,
	[Type.LOGOUT]: reset,
}

export default createReducer(INITIAL_STATE, ACTION_HANDLERS)
