import { createTypes } from 'reduxsauce'

export default createTypes(`
	LOGIN_WITH_EMAIL_ATTEMPT
	LOGIN_WITH_FACEBOOK_ATTEMPT
	LOGIN_SUCCESS
	LOGIN_FAILURE
	REGISTER_ATTEMPT
	REGISTER_SUCCESS
	REGISTER_FAILURE

	FORGOT_PASSWORD_ATTEMPT
	FORGOT_PASSWORD_SUCCESS
	FORGOT_PASSWORD_FAILURE
	VALIDATE_REGISTRATION_NUMBER_ATTEMPT
	VALIDATE_REGISTRATION_NUMBER_SUCCESS
	VALIDATE_REGISTRATION_NUMBER_FAILURE
	REGISTER_PROFILE_ATTEMPT
	REGISTER_PROFILE_SUCCESS
	REGISTER_PROFILE_FAILURE

	GET_USER_ATTEMPT
	GET_USER_SUCCESS
	GET_USER_FAILURE
	UPDATE_USER_ATTEMPT
	UPDATE_USER_SUCCESS
	UPDATE_USER_FAILURE
	VERIFY_PASSWORD_ATTEMPT
	VERIFY_PASSWORD_SUCCESS
	VERIFY_PASSWORD_FAILURE
	UPDATE_PASSWORD_ATTEMPT
	UPDATE_PASSWORD_SUCCESS
	UPDATE_PASSWORD_FAILURE

	LOGOUT
`)