// A list of all actions
import { createTypes } from 'reduxsauce'

export default createTypes(`
	GET_VIDEO_CATEGORIES_ATTEMPT
	GET_VIDEO_CATEGORIES_SUCCESS
	GET_VIDEO_CATEGORIES_FAILURE

	GET_CATEGORY_VIDEOS_ATTEMPT
	GET_CATEGORY_VIDEOS_SUCCESS
	GET_CATEGORY_VIDEOS_FAILURE

	FILTER_VIDEOS_ATTEMPT
	FILTER_VIDEOS_SUCCESS

	LOAD_VIDEO_ATTEMPT
	LOAD_VIDEO_SUCCESS
	LOAD_VIDEO_FAILURE
	UNSET_VIDEO
	VIEW_VIDEO_ATTEMPT
	VIEW_VIDEO_SUCCESS

	LIKE_VIDEO_ATTEMPT
	LIKE_VIDEO_FAILURE

	UNLIKE_VIDEO_ATTEMPT
	UNLIKE_VIDEO_FAILURE
`)
