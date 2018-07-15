import Type from './type'

// IQA
const getIqaWorkbooksAttempt = () => ({ type: Type.GET_IQA_WORKBOOKS_ATTEMPT })
const getIqaWorkbooksSuccess = (workbooks, message) => ({ type: Type.GET_IQA_WORKBOOKS_SUCCESS, workbooks, message })
const getIqaWorkbooksFailure = errorCode => ({ type: Type.GET_IQA_WORKBOOKS_FAILURE, errorCode })

const getIqaWorkbookAttempt = (unit_id, workbook_id) => ({ type: Type.GET_IQA_WORKBOOK_ATTEMPT, unit_id, workbook_id })
const getIqaWorkbookSuccess = (workbook, activities, message) => ({
	type: Type.GET_IQA_WORKBOOK_SUCCESS, workbook, activities, message,
})
const getIqaWorkbookFailure = errorCode => ({ type: Type.GET_IQA_WORKBOOK_FAILURE, errorCode })

const getIqaWorkbookActivityAttempt = (unit_id, workbook_id, activity_code) => ({
	type: Type.GET_IQA_WORKBOOK_ACTIVITY_ATTEMPT, unit_id, workbook_id, activity_code,
})

const getIqaWorkbookActivitySuccess = (activity, message) => ({
	type: Type.GET_IQA_WORKBOOK_ACTIVITY_SUCCESS, activity, message,
})

const getIqaWorkbookActivityFailure = errorCode => ({
	type: Type.GET_IQA_WORKBOOK_ACTIVITY_FAILURE, errorCode,
})

const filterIqaWorkbooksAttempt = query => ({ type: Type.FILTER_IQA_WORKBOOKS_ATTEMPT, query })
const filterIqaWorkbooksSuccess = workbooks => ({ type: Type.FILTER_IQA_WORKBOOKS_SUCCESS, workbooks })

const updateIqaWorkbooksSettingsAttempt = (settingsSortBy, settingsOrder) => ({
	type: Type.UPDATE_IQA_WORKBOOKS_SETTINGS_ATTEMPT, settingsSortBy, settingsOrder,
})
const updateIqaWorkbooksSettingsSuccess = (settingsSortBy, settingsOrder) => ({
	type: Type.UPDATE_IQA_WORKBOOKS_SETTINGS_SUCCESS, settingsSortBy, settingsOrder,
})

// User
const getQualificationsAttempt = sectorId => ({ type: Type.GET_QUALIFICATIONS_ATTEMPT, sectorId })
const getQualificationsSuccess = qualifications => ({ type: Type.GET_QUALIFICATIONS_SUCCESS, qualifications })
const getQualificationsFailure = errorCode => ({ type: Type.GET_QUALIFICATIONS_FAILURE, errorCode })

const setCurrentQualifiactionId = qualificationId => ({ type: Type.SET_CURRENT_QUALIFICATION_ID, qualificationId })

const setActiveQualificationId = qualificationId => ({ type: Type.SET_ACTIVE_QUALIFICATION_ID, qualificationId })
const unsetActiveQualificationId = () => ({ type: Type.UNSET_ACTIVE_QUALIFICATION_ID })

const setWorkbooksSearchQuery = query => ({ type: Type.SET_WORKBOOKS_SEARCH_QUERY, query })


const getWorkbookAttempt = (member_id, workbook_id) => ({ type: Type.GET_WORKBOOK_ATTEMPT, member_id, workbook_id })
const getWorkbookSuccess = (workbook, activities, message) => ({
	type: Type.GET_WORKBOOK_SUCCESS, workbook, activities, message,
})
const getWorkbookFailure = errorCode => ({ type: Type.GET_WORKBOOK_FAILURE, errorCode })

const getWorkbookActivityAttempt = (member_id, activity_id) => ({
	type: Type.GET_WORKBOOK_ACTIVITY_ATTEMPT, member_id, activity_id,
})

const getWorkbookActivitySuccess = (activity, solution, message) => ({
	type: Type.GET_WORKBOOK_ACTIVITY_SUCCESS, activity, solution, message,
})

const getWorkbookActivityFailure = errorCode => ({
	type: Type.GET_WORKBOOK_ACTIVITY_FAILURE, errorCode,
})


const saveWorkbookActivityAttempt = (activity_id, evidence, submit) => ({
	type: Type.SAVE_WORKBOOK_ACTIVITY_ATTEMPT, activity_id, evidence, submit,
})

const saveWorkbookActivitySuccess = (activity, solution, message, submit) => ({
	type: Type.SAVE_WORKBOOK_ACTIVITY_SUCCESS, activity, solution, message, submit,
})

const saveWorkbookActivityFailure = (errorCode, submit) => ({
	type: Type.SAVE_WORKBOOK_ACTIVITY_FAILURE, errorCode, submit,
})


const unsetWorkbook = () => ({ type: Type.UNSET_WORKBOOK })
const unsetActivity = () => ({ type: Type.UNSET_ACTIVITY })


export default {
	getIqaWorkbooksAttempt,
	getIqaWorkbooksSuccess,
	getIqaWorkbooksFailure,
	getIqaWorkbookAttempt,
	getIqaWorkbookSuccess,
	getIqaWorkbookFailure,
	getIqaWorkbookActivityAttempt,
	getIqaWorkbookActivitySuccess,
	getIqaWorkbookActivityFailure,
	filterIqaWorkbooksAttempt,
	filterIqaWorkbooksSuccess,
	updateIqaWorkbooksSettingsAttempt,
	updateIqaWorkbooksSettingsSuccess,

	getQualificationsAttempt,
	getQualificationsSuccess,
	getQualificationsFailure,
	setActiveQualificationId,
	setCurrentQualifiactionId,
	unsetActiveQualificationId,
	setWorkbooksSearchQuery,

	getWorkbookAttempt,
	getWorkbookSuccess,
	getWorkbookFailure,

	getWorkbookActivityAttempt,
	getWorkbookActivitySuccess,
	getWorkbookActivityFailure,
	saveWorkbookActivityAttempt,
	saveWorkbookActivitySuccess,
	saveWorkbookActivityFailure,

	unsetWorkbook,
	unsetActivity,
}
