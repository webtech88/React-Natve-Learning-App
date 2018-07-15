import { createTypes } from 'reduxsauce'

export default createTypes(`
	GET_IQA_WORKBOOKS_ATTEMPT
	GET_IQA_WORKBOOKS_SUCCESS
	GET_IQA_WORKBOOKS_FAILURE
	FILTER_IQA_WORKBOOKS_ATTEMPT
	FILTER_IQA_WORKBOOKS_SUCCESS
	UPDATE_IQA_WORKBOOKS_SETTINGS_ATTEMPT
	UPDATE_IQA_WORKBOOKS_SETTINGS_SUCCESS
	GET_IQA_WORKBOOK_ATTEMPT
	GET_IQA_WORKBOOK_SUCCESS
	GET_IQA_WORKBOOK_FAILURE
	GET_IQA_WORKBOOK_ACTIVITY_ATTEMPT
	GET_IQA_WORKBOOK_ACTIVITY_SUCCESS
	GET_IQA_WORKBOOK_ACTIVITY_FAILURE

	GET_QUALIFICATIONS_ATTEMPT
	GET_QUALIFICATIONS_SUCCESS
	GET_QUALIFICATIONS_FAILURE
	SET_ACTIVE_QUALIFICATION_ID
	SET_CURRENT_QUALIFICATION_ID
	UNSET_ACTIVE_QUALIFICATION_ID
	SET_WORKBOOKS_SEARCH_QUERY
	GET_WORKBOOK_ATTEMPT
	GET_WORKBOOK_SUCCESS
	GET_WORKBOOK_FAILURE
	GET_WORKBOOK_ACTIVITY_ATTEMPT
  	GET_WORKBOOK_ACTIVITY_SUCCESS
  	GET_WORKBOOK_ACTIVITY_FAILURE
	SAVE_WORKBOOK_ACTIVITY_ATTEMPT
	SAVE_WORKBOOK_ACTIVITY_SUCCESS
	SAVE_WORKBOOK_ACTIVITY_FAILURE

	UNSET_WORKBOOK
	UNSET_ACTIVITY
`)