import R from 'ramda'
import { takeEvery, put, call, fork, select, all } from 'redux-saga/effects'
// import { Actions as NavigationActions } from 'react-native-router-flux';

import Type from '../actions/type'
import CoreActions from '../../core/actions/creator'
import VideoActions from '../actions/creator'
import { translate } from '../../core/config/lang'

const getVideoCategories = state => state.video.data


export default (api) => {
	// Get video categories
	function* getVideoCategoriesAttempt(action) {
		const { sector_id } = action

		try {
			const response = yield call(api.getVideoCategories, sector_id)

			if (response && response.ok && response.data && response.data.status === 'success' && response.data.data) {
				const categories = response.data.data.categories

				if (categories && categories.length) {
					// NOTE improvements needed
					yield all(categories.map((category, index) => put(VideoActions.getCategoryVideosAttempt(index, category.video_category_id))))
				}

				yield put(VideoActions.getVideoCategoriesSuccess(categories))
			} else {
				const problem = (response && response.data && response.data.message) || 'System error. Please try again later.'
				yield put(VideoActions.getVideoCategoriesFailure(problem))
			}
		} catch (err) {
			yield put(VideoActions.getVideoCategoriesFailure(err))
		}
	}

	// function* getVideoCategoriesSuccess(action) {
	// 	const { categories } = action;
	// 	// yield put(CoreActions.setNotification('success', 'Video categories loaded.'))
	// }

	function* getVideoCategoriesFailure(action) {
		const { errorCode } = action
		yield put(CoreActions.setNotification('danger', yield translate(errorCode)))
	}


	// Get category videos
	function* getCategoryVideosAttempt(action) {
		const { category_id, index } = action

		try {
			const response = yield call(api.getCategoryVideos, category_id)

			if (response && response.ok && response.data && response.data.status === 'success' && response.data.data) {
				yield put(VideoActions.getCategoryVideosSuccess(index, response.data.data.videos))
			} else {
				const problem = (response && response.data && response.data.message)
					|| 'System error. Please try again later.'
				yield put(VideoActions.getCategoryVideosFailure(problem))
			}
		} catch (err) {
			yield put(VideoActions.getCategoryVideosFailure(err))
		}
	}

	// function* getCategoryVideosSuccess(action) {
	// 	const { videos } = action;
	// 	// yield put(CoreActions.setNotification('success', 'Videos loaded.'))
	// }

	// function* getCategoryVideosFailure(action) {
	// 	const { errorCode } = action;
	// 	yield put(CoreActions.setNotification('danger', errorCode))
	// }


	// Filter videos
	function* filterVideosAttempt(action) {
		const { query } = action
		const includes = str => str.includes(query.toLowerCase())
		const categories = yield select(getVideoCategories)
		let videos = []
		let filteredVideos = null

		if (query && categories) {
			categories.every((category, index) => {
				videos = [
					...videos,
					...category.videos,
				]

				return category
			})

			filteredVideos = R.filter(
				R.pipe(R.props(['title', 'description', 'tags']),
				R.any(R.pipe(R.toString, R.toLower, includes))),
			)(videos)
		}

		yield put(VideoActions.filterVideosSuccess(filteredVideos))
	}


	// Load video
	function* loadVideoAttempt(action) {
		const { member_id, media_id, video_category_id } = action
		const categories = yield select(getVideoCategories)

		const categoryIndex = R.findIndex(R.propEq('video_category_id', video_category_id))(categories)
		const videoIndex = categories[categoryIndex] && R.findIndex(R.propEq('media_id', media_id))(categories[categoryIndex].videos)

		if (categoryIndex !== undefined && videoIndex !== undefined) {
			yield put(VideoActions.loadVideoSuccess(categoryIndex, videoIndex))
			yield put(VideoActions.viewVideoAttempt(member_id, media_id))
		} else {
			yield put(VideoActions.loadVideoFailure('Could not load video.'))
		}
	}

	// function* loadVideoSuccess(action) {
	// 	const { video } = action;
	// 	yield put(CoreActions.setNotification('success', 'Video loaded.'))
	// }

	// function* loadVideoFailure(action) {
	// 	const { errorCode } = action;
	// 	yield put(CoreActions.setNotification('danger', errorCode))
	// }


	// View video
	function* viewVideoAttempt(action) {
		const { member_id, media_id } = action

		try {
			const { member_id, media_id } = action
			const response = yield call(api.viewMedia, member_id, media_id)

			if (response && response.ok && response.data && response.data.status === 'success') {
				yield put(VideoActions.viewVideoSuccess(media_id))
			}
			// else {
			// 	const problem = (response && response.data && response.data.message) || 'System error. Please try again later.';
			// 	yield put(VideoActions.getCategoryVideosFailure(problem))
			// }
		} catch (err) {}
	}

	function* likeVideoAttempt(action) {
		const { memberId, mediaId } = action

		try {
			const response = yield call(api.likeMedia, memberId, mediaId)

			if (!(response && response.ok && response.data && response.data.status === 'success')) {
				yield put(VideoActions.likeVideoFailure(mediaId))
			}
		} catch (err) {
			yield put(VideoActions.likeVideoFailure(mediaId))
		}
	}

	function* unlikeVideoAttempt(action) {
		const { memberId, mediaId } = action

		try {
			const response = yield call(api.unlikeMedia, memberId, mediaId)

			if (!(response && response.ok && response.data && response.data.status === 'success')) {
				yield put(VideoActions.unlikeVideoFailure(mediaId))
			}
		} catch (err) {
			yield put(VideoActions.unlikeVideoFailure(mediaId))
		}
	}

	// function* viewVideoSuccess(action) {
	// 	const { XXX } = action;
	// 	// yield put(CoreActions.setNotification('success', 'Video viewed.'))
	// }


	// The Main Watcher function
	function* startWatchers() {
		yield fork(takeEvery, Type.GET_VIDEO_CATEGORIES_ATTEMPT, getVideoCategoriesAttempt)
		// yield fork(takeEvery, Type.GET_VIDEO_CATEGORIES_SUCCESS, getVideoCategoriesSuccess)
		yield fork(takeEvery, Type.GET_VIDEO_CATEGORIES_FAILURE, getVideoCategoriesFailure)
		yield fork(takeEvery, Type.GET_CATEGORY_VIDEOS_ATTEMPT, getCategoryVideosAttempt)
		// yield fork(takeEvery, Type.GET_CATEGORY_VIDEOS_SUCCESS, getCategoryVideosSuccess)
		// yield fork(takeEvery, Type.GET_CATEGORY_VIDEOS_FAILURE, getCategoryVideosFailure)
		yield fork(takeEvery, Type.FILTER_VIDEOS_ATTEMPT, filterVideosAttempt)
		yield fork(takeEvery, Type.LOAD_VIDEO_ATTEMPT, loadVideoAttempt)
		// yield fork(takeEvery, Type.LOAD_VIDEO_SUCCESS, loadVideoSuccess)
		// yield fork(takeEvery, Type.LOAD_VIDEO_FAILURE, loadVideoFailure)
		yield fork(takeEvery, Type.VIEW_VIDEO_ATTEMPT, viewVideoAttempt)
		// yield fork(takeEvery, Type.VIEW_VIDEO_SUCCESS, viewVideoSuccess)
		yield fork(takeEvery, Type.LIKE_VIDEO_ATTEMPT, likeVideoAttempt)
		yield fork(takeEvery, Type.UNLIKE_VIDEO_ATTEMPT, unlikeVideoAttempt)
	}

	return {
		startWatchers,
	}
}
