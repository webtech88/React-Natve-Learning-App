import Type from './type'


const getVideoCategoriesAttempt = sector_id => ({ type: Type.GET_VIDEO_CATEGORIES_ATTEMPT, sector_id })
const getVideoCategoriesSuccess = categories => ({ type: Type.GET_VIDEO_CATEGORIES_SUCCESS, categories })
const getVideoCategoriesFailure = errorCode => ({ type: Type.GET_VIDEO_CATEGORIES_FAILURE, errorCode })

const getCategoryVideosAttempt = (index, category_id) =>
	({ type: Type.GET_CATEGORY_VIDEOS_ATTEMPT, index, category_id })
const getCategoryVideosSuccess = (index, videos) => ({ type: Type.GET_CATEGORY_VIDEOS_SUCCESS, index, videos })
const getCategoryVideosFailure = errorCode => ({ type: Type.GET_CATEGORY_VIDEOS_FAILURE, errorCode })

const filterVideosAttempt = query => ({ type: Type.FILTER_VIDEOS_ATTEMPT, query })
const filterVideosSuccess = videos => ({ type: Type.FILTER_VIDEOS_SUCCESS, videos })

const loadVideoAttempt = (member_id, media_id, video_category_id) =>
	({ type: Type.LOAD_VIDEO_ATTEMPT, member_id, media_id, video_category_id })
const loadVideoSuccess = (categoryIndex, videoIndex) => ({ type: Type.LOAD_VIDEO_SUCCESS, categoryIndex, videoIndex })
const loadVideoFailure = errorCode => ({ type: Type.LOAD_VIDEO_FAILURE, errorCode })

const likeVideoAttempt = (memberId, mediaId) => ({ type: Type.LIKE_VIDEO_ATTEMPT, memberId, mediaId })
const likeVideoFailure = mediaId => ({ type: Type.LIKE_VIDEO_FAILURE, mediaId })

const unlikeVideoAttempt = (memberId, mediaId) => ({ type: Type.UNLIKE_VIDEO_ATTEMPT, memberId, mediaId })
const unlikeVideoFailure = mediaId => ({ type: Type.UNLIKE_VIDEO_ATTEMPT, mediaId })

const unsetVideo = () => ({ type: Type.UNSET_VIDEO })

const viewVideoAttempt = (member_id, media_id) => ({ type: Type.VIEW_VIDEO_ATTEMPT, member_id, media_id })
const viewVideoSuccess = media_id => ({ type: Type.VIEW_VIDEO_SUCCESS, media_id })


// Makes available all the action creators we've created.
export default {
	// Video categories
	getVideoCategoriesAttempt,
	getVideoCategoriesSuccess,
	getVideoCategoriesFailure,
	// Category videos
	getCategoryVideosAttempt,
	getCategoryVideosSuccess,
	getCategoryVideosFailure,
	// Filter videos
	filterVideosAttempt,
	filterVideosSuccess,
	// Video
	loadVideoAttempt,
	loadVideoSuccess,
	loadVideoFailure,
	unsetVideo,
	viewVideoAttempt,
	viewVideoSuccess,
	likeVideoAttempt,
	likeVideoFailure,
	unlikeVideoAttempt,
	unlikeVideoFailure,
}
