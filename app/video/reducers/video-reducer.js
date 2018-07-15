import Immutable from 'seamless-immutable'
import { createReducer } from 'reduxsauce'

import Type from '../actions/type'
import CoreActionsType from '../../core/actions/type'
import { findVideo } from '../util/helpers'

export const INITIAL_STATE = Immutable({
	gettingVideoCategories: false,
	data: null,
	filterQuery: '',
	filterData: null,
	loadingVideo: false,
	categoryIndex: null,
	videoIndex: null,
	errorCode: null,
})


const getVideoCategoriesAttempt = state => state.merge({ gettingVideoCategories: true, errorCode: null })

const getVideoCategoriesSuccess = (state, action) => {
	const { categories } = action

	const data = categories.map(category => ({
		...category,
		gettingVideos: false,
		videos: null,
	}))

	return state.merge({ gettingVideoCategories: false, data, errorCode: null })
}

const getVideoCategoriesFailure = (state, action) =>
	state.merge({ gettingVideoCategories: false, errorCode: action.errorCode })


const getCategoryVideosAttempt = (state, action) => {
	const { index } = action
	const { data } = state
	let categories = data

	if (data && data[index]) {
		categories = [
			...data.slice(0, index),
			{
				...data[index],
				gettingVideos: true,
			},
			...data.slice(index + 1),
		]
	}

	return state.merge({ data: categories, errorCode: null })
}

const getCategoryVideosSuccess = (state, action) => {
	const { index, videos } = action
	const { data } = state
	let categories = data

	// console.log('A', categories);

	if (data && data[index]) {
		// TODO this is temporary fix
		const updatedVideos = videos.map(video => ({
			...video,
			video_category_id: data[index].video_category_id,
		}))

		categories = [
			...data.slice(0, index),
			{
				...data[index],
				gettingVideos: false,
				videos: updatedVideos,
			},
			...data.slice(index + 1),
		]
	}

	// console.log('B', categories);

	return state.merge({ data: categories, errorCode: null })
}

const getCategoryVideosFailure = (state, action) => {
	const { index } = action
	const { data } = state
	let categories = data

	if (data && data[index]) {
		categories = [
			...data.slice(0, index),
			{
				...data[index],
				gettingVideos: true,
			},
			...data.slice(index + 1),
		]
	}

	return state.merge({ data: categories, errorCode: action.errorCode })
}


const filterVideosAttempt = (state, action) => {
	const { query } = action
	return state.merge({ filterQuery: query })
}

const filterVideosSuccess = (state, action) => {
	const { videos } = action
	return state.merge({ filterData: videos })
}


const loadVideoAttempt = state =>
	state.merge({ loadingVideo: true, categoryIndex: null, videoIndex: null, errorCode: null })

const loadVideoSuccess = (state, action) => {
	const { categoryIndex, videoIndex } = action
	return state.merge({ loadingVideo: false, categoryIndex, videoIndex, errorCode: null })
}

const loadVideoFailure = (state, action) => {
	const { errorCode } = action
	return state.merge({ loadingVideo: false, categoryIndex: null, videoIndex: null, errorCode })
}

const unsetVideo = state =>
	state.merge({ loadingVideo: false, categoryIndex: null, videoIndex: null, errorCode: null })

const viewVideoSuccess = (state, action) => {
	const { media_id } = action
	const { data: categories } = state
	const { categoryIndex, videoIndex } = findVideo(categories, media_id)
	const viewed = Immutable.getIn(state, ['data', categoryIndex, 'videos', videoIndex, 'viewed'])

	return Immutable.setIn(state, ['data', categoryIndex, 'videos', videoIndex, 'viewed'], viewed + 1)
}

const likeVideoAttempt = (state, action) => {
	const { mediaId } = action
	const { data: categories } = state
	const { categoryIndex, videoIndex } = findVideo(categories, mediaId)
	const video = Immutable.getIn(state, ['data', categoryIndex, 'videos', videoIndex])
	const updatedVideo = video.merge({
		liked: video.liked + 1,
		member_actions: {
			liked: 1,
		},
	})

	return Immutable.setIn(state, ['data', categoryIndex, 'videos', videoIndex], updatedVideo)
}

const unLikeVideoAttempt = (state, action) => {
	const { mediaId } = action
	const { data: categories } = state
	const { categoryIndex, videoIndex } = findVideo(categories, mediaId)
	const video = Immutable.getIn(state, ['data', categoryIndex, 'videos', videoIndex])
	const updatedVideo = video.merge({
		liked: video.liked - 1,
		member_actions: {
			liked: 0,
		},
	})

	return Immutable.setIn(state, ['data', categoryIndex, 'videos', videoIndex], updatedVideo)
}

// Reset
const reset = () => INITIAL_STATE


// map our types to our handlers
const ACTION_HANDLERS = {
	// Video categories
	[Type.GET_VIDEO_CATEGORIES_ATTEMPT]: getVideoCategoriesAttempt,
	[Type.GET_VIDEO_CATEGORIES_SUCCESS]: getVideoCategoriesSuccess,
	[Type.GET_VIDEO_CATEGORIES_FAILURE]: getVideoCategoriesFailure,
	// Category videos
	[Type.GET_CATEGORY_VIDEOS_ATTEMPT]: getCategoryVideosAttempt,
	[Type.GET_CATEGORY_VIDEOS_SUCCESS]: getCategoryVideosSuccess,
	[Type.GET_CATEGORY_VIDEOS_FAILURE]: getCategoryVideosFailure,
	// Filter videos
	[Type.FILTER_VIDEOS_ATTEMPT]: filterVideosAttempt,
	[Type.FILTER_VIDEOS_SUCCESS]: filterVideosSuccess,
	// Video
	[Type.LOAD_VIDEO_ATTEMPT]: loadVideoAttempt,
	[Type.LOAD_VIDEO_SUCCESS]: loadVideoSuccess,
	[Type.LOAD_VIDEO_FAILURE]: loadVideoFailure,
	[Type.UNSET_VIDEO]: unsetVideo,
	[Type.VIEW_VIDEO_SUCCESS]: viewVideoSuccess,
	[Type.LIKE_VIDEO_ATTEMPT]: likeVideoAttempt,
	[Type.LIKE_VIDEO_FAILURE]: unLikeVideoAttempt,
	[Type.UNLIKE_VIDEO_ATTEMPT]: unLikeVideoAttempt,
	[Type.UNLIKE_VIDEO_FAILURE]: likeVideoAttempt,
	// Reset
	[CoreActionsType.APP_RESET_ATTEMPT]: reset,
}

export default createReducer(INITIAL_STATE, ACTION_HANDLERS)
