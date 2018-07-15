import Type from './type'

const loginWithEmailAttempt = user => ({ type: Type.LOGIN_WITH_EMAIL_ATTEMPT, user })
const loginWithFacebookAttempt = () => ({ type: Type.LOGIN_WITH_FACEBOOK_ATTEMPT })
const loginSuccess = token => ({ type: Type.LOGIN_SUCCESS, token })
const loginFailure = errorCode => ({ type: Type.LOGIN_FAILURE, errorCode })

const registerAttempt = user => ({ type: Type.REGISTER_ATTEMPT, user })
const registerSuccess = token => ({ type: Type.REGISTER_SUCCESS, token })
const registerFailure = (errorCode, errors) => ({ type: Type.REGISTER_FAILURE, errorCode, errors })

const forgotPasswordAttempt = email => ({ type: Type.FORGOT_PASSWORD_ATTEMPT, email })
const forgotPasswordSuccess = message => ({ type: Type.FORGOT_PASSWORD_SUCCESS, message })
const forgotPasswordFailure = errorCode => ({ type: Type.FORGOT_PASSWORD_FAILURE, errorCode })


const validateRegistrationNumberAttempt = user => ({ type: Type.VALIDATE_REGISTRATION_NUMBER_ATTEMPT, user })
const validateRegistrationNumberSuccess = user => ({ type: Type.VALIDATE_REGISTRATION_NUMBER_SUCCESS, user })
const validateRegistrationNumberFailure = (errorCode, errors) =>
	({ type: Type.VALIDATE_REGISTRATION_NUMBER_FAILURE, errorCode, errors })

const registerProfileAttempt = user => ({ type: Type.REGISTER_PROFILE_ATTEMPT, user })
const registerProfileSuccess = user => ({ type: Type.REGISTER_PROFILE_SUCCESS, user })
const registerProfileFailure = (errorCode, errors) => ({ type: Type.REGISTER_PROFILE_FAILURE, errorCode, errors })


const getUserAttempt = auth => ({ type: Type.GET_USER_ATTEMPT, auth })
const getUserSuccess = (user, auth) => ({ type: Type.GET_USER_SUCCESS, user, auth })
const getUserFailure = (errorCode, auth) => ({ type: Type.GET_USER_FAILURE, errorCode, auth })

const updateUserAttempt = (member_id, user) => ({ type: Type.UPDATE_USER_ATTEMPT, member_id, user })
const updateUserSuccess = (user, message) => ({ type: Type.UPDATE_USER_SUCCESS, user, message })
const updateUserFailure = (errorCode, errors) => ({ type: Type.UPDATE_USER_FAILURE, errorCode, errors })

const verifyPasswordAttempt = user => ({ type: Type.VERIFY_PASSWORD_ATTEMPT, user })
const verifyPasswordSuccess = token => ({ type: Type.VERIFY_PASSWORD_SUCCESS, token })
const verifyPasswordFailure = errorCode => ({ type: Type.VERIFY_PASSWORD_FAILURE, errorCode })

const updatePasswordAttempt = user => ({ type: Type.UPDATE_PASSWORD_ATTEMPT, user })
const updatePasswordSuccess = message => ({ type: Type.UPDATE_PASSWORD_SUCCESS, message })
const updatePasswordFailure = errorCode => ({ type: Type.UPDATE_PASSWORD_FAILURE, errorCode })

const logout = () => ({ type: Type.LOGOUT })


// Makes available all the action creators we've created.
export default {
	loginWithEmailAttempt,
	loginWithFacebookAttempt,
	loginSuccess,
	loginFailure,
	registerAttempt,
	registerSuccess,
	registerFailure,
	forgotPasswordAttempt,
	forgotPasswordSuccess,
	forgotPasswordFailure,

	validateRegistrationNumberAttempt,
	validateRegistrationNumberSuccess,
	validateRegistrationNumberFailure,
	registerProfileAttempt,
	registerProfileSuccess,
	registerProfileFailure,

	getUserAttempt,
	getUserSuccess,
	getUserFailure,
	updateUserAttempt,
	updateUserSuccess,
	updateUserFailure,
	verifyPasswordAttempt,
	verifyPasswordSuccess,
	verifyPasswordFailure,
	updatePasswordAttempt,
	updatePasswordSuccess,
	updatePasswordFailure,

	logout,
}
