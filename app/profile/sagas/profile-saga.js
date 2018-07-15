import R from 'ramda'
import { takeEvery, put, call, fork, select } from 'redux-saga/effects'
import { Actions as NavigationActions } from 'react-native-router-flux'

import Type from '../actions/type'
import CoreActions from '../../core/actions/creator'
import ProfileActions from '../actions/creator'
import { translate } from '../../core/config/lang'

const getUserId = state => state.user.data && state.user.data.member_id
const getUserPhotos = state => state.profile.photos
const getConnectionPhotos = state => state.profile.connectionProfile.photos
const getUserVideos = state => state.profile.videos
const getConnectionVideos = state => state.profile.connectionProfile.videos


export default (api) => {
	// Get connection profile
	function* getConnectionProfileAttempt(action) {
		const { member_id } = action

		try {
			const response = yield call(api.getProfile, member_id)

			if (response && response.ok && response.data && response.data.status === 'success' && response.data.data) {
				yield put(ProfileActions.getConnectionProfileSuccess(response.data.data))
			} else {
				const problem = (response && response.data && response.data.message)
					|| 'System error. Please try again later.'
				yield put(ProfileActions.getConnectionProfileFailure(yield translate(problem)))
			}
		} catch (err) {
			yield put(ProfileActions.getConnectionProfileFailure(err))
		}
	}

	// Get user profile photos
	function* getUserProfilePhotosAttempt(action) {
		const { member_id } = action

		try {
			const response = yield call(api.getProfilePhotos, member_id)

			if (response && response.ok && response.data && response.data.status === 'success' && response.data.data) {
				yield put(ProfileActions.getUserProfilePhotosSuccess(response.data.data.photos))
			} else {
				const problem = (response && response.data && response.data.message)
					|| 'System error. Please try again later.'
				yield put(ProfileActions.getUserProfilePhotosFailure(yield translate(problem)))
			}
		} catch (err) {
			yield put(ProfileActions.getUserProfilePhotosFailure(err))
		}
	}

	function* searchUserProfilePhotosAttempt(action) {
		const { query } = action
		const includes = str => str.includes(query.toLowerCase())
		const photos = yield select(getUserPhotos)
		let filteredPhotos = []

		filteredPhotos = R.filter(R.pipe(
			R.props(['title', 'description', 'tags']),
			R.any(R.pipe(R.toString, R.toLower, includes)),
		))(photos)

		yield put(ProfileActions.searchUserProfilePhotosSuccess(filteredPhotos))
	}

	// Get connection profile photos
	function* getConnectionProfilePhotosAttempt(action) {
		const { member_id } = action

		try {
			const response = yield call(api.getProfilePhotos, member_id)

			if (response && response.ok && response.data && response.data.status === 'success' && response.data.data) {
				yield put(ProfileActions.getConnectionProfilePhotosSuccess(response.data.data.photos))
			} else {
				const problem = (response && response.data && response.data.message)
				|| 'System error. Please try again later.'
				yield put(ProfileActions.getConnectionProfilePhotosFailure(yield translate(problem)))
			}
		} catch (err) {
			yield put(ProfileActions.getConnectionProfilePhotosFailure(err))
		}
	}

	function* searchConnectionProfilePhotosAttempt(action) {
		const { query } = action
		const includes = str => str.includes(query.toLowerCase())
		const photos = yield select(getConnectionPhotos)
		let filteredPhotos = []

		filteredPhotos = R.filter(R.pipe(
			R.props(['title', 'description', 'tags']),
			R.any(R.pipe(R.toString, R.toLower, includes)),
		))(photos)

		yield put(ProfileActions.searchConnectionProfilePhotosSuccess(filteredPhotos))
	}

	// Get user profile videos
	function* getUserProfileVideosAttempt(action) {
		const { member_id } = action

		try {
			const response = yield call(api.getProfileVideos, member_id)

			if (response && response.ok && response.data && response.data.status === 'success' && response.data.data) {
				yield put(ProfileActions.getUserProfileVideosSuccess(response.data.data.videos))
			} else {
				const problem = (response && response.data && response.data.message)
					|| 'System error. Please try again later.'
				yield put(ProfileActions.getUserProfileVideosFailure(yield translate(problem)))
			}
		} catch (err) {
			yield put(ProfileActions.getUserProfileVideosFailure(err))
		}
	}

	function* searchUserProfileVideosAttempt(action) {
		const { query } = action
		const includes = str => str.includes(query.toLowerCase())
		const videos = yield select(getUserVideos)
		let filteredVideos = []

		filteredVideos = R.filter(R.pipe(
			R.props(['title', 'description', 'tags']),
			R.any(R.pipe(R.toString, R.toLower, includes)),
		))(videos)

		yield put(ProfileActions.searchUserProfileVideosSuccess(filteredVideos))
	}

	// Get connection profile videos
	function* getConnectionProfileVideosAttempt(action) {
		const { member_id } = action

		try {
			const response = yield call(api.getProfileVideos, member_id)

			if (response && response.ok && response.data && response.data.status === 'success' && response.data.data) {
				yield put(ProfileActions.getConnectionProfileVideosSuccess(response.data.data.videos))
			} else {
				const problem = (response && response.data && response.data.message)
					|| 'System error. Please try again later.'
				yield put(ProfileActions.getConnectionProfileVideosFailure(yield translate(problem)))
			}
		} catch (err) {
			yield put(ProfileActions.getConnectionProfileVideosFailure(err))
		}
	}

	function* searchConnectionProfileVideosAttempt(action) {
		const { query } = action
		const includes = str => str.includes(query.toLowerCase())
		const videos = yield select(getConnectionVideos)
		let filteredVideos = []

		filteredVideos = R.filter(R.pipe(
			R.props(['title', 'description', 'tags']),
			R.any(R.pipe(R.toString, R.toLower, includes)),
		))(videos)

		yield put(ProfileActions.searchConnectionProfileVideosSuccess(filteredVideos))
	}

	// Load user photo
	function* loadUserProfilePhotoAttempt(action) {
		const { mediaId } = action
		const photos = yield select(getUserPhotos)
		let photo

		if (photos) {
			photo = R.find(R.propEq('media_id', mediaId))(photos)
		}

		if (photo) {
			yield put(ProfileActions.loadUserProfilePhotoSuccess(photo))
		} else {
			yield put(ProfileActions.unsetUserProfilePhoto())
		}
	}

	// Load connection photo
	function* loadConnectionProfilePhotoAttempt(action) {
		const { mediaId } = action
		const photos = yield select(getConnectionPhotos)
		let photo

		if (photos) {
			photo = R.find(R.propEq('media_id', mediaId))(photos)
		}

		if (photo) {
			yield put(ProfileActions.loadConnectionProfilePhotoSuccess(photo))
			yield put(ProfileActions.viewConnectionProfileMediaAttempt(mediaId, photo.type))
		} else {
			yield put(ProfileActions.unsetConnectionProfilePhoto())
		}
	}

	// Add/Update/Delete user photo
	function* submitProfilePhotoAttempt(action) {
		const { media_id, photo } = action
		const userId = yield select(getUserId)

		try {
			let response
			if (media_id > 0) {
				response = yield call(api.updateProfilePhoto, userId, media_id, photo)
			} else {
				response = yield call(api.addProfilePhoto, userId, photo)
			}

			if (response && response.ok && response.data && response.data.status === 'success') {
				const message = (response && response.data && response.data.message) || 'Profile photo updated.'
				yield call(NavigationActions.pop)
				if (media_id > 0) {
					yield put(ProfileActions.updateProfilePhotoSuccess({ ...photo, media_id }, yield translate(message)))
				} else {
					yield put(ProfileActions.addProfilePhotoSuccess(response.data.data, yield translate(message)))
				}
			} else {
				const problem = (response && response.data && response.data.message)
					|| 'System error. Please try again later.'
				yield put(ProfileActions.submitProfilePhotoFailure(yield translate(problem)))
			}
		} catch (err) {
			yield put(ProfileActions.submitProfilePhotoFailure(err))
		}
	}

	function* addProfilePhotoSuccess(action) {
		const { message } = action
		yield put(CoreActions.setNotification('success', yield translate(message)))
	}

	function* updateProfilePhotoSuccess(action) {
		const { message } = action
		yield put(CoreActions.setNotification('success', yield translate(message)))
	}

	function* submitProfilePhotoFailure(action) {
		const { errorCode } = action
		yield put(CoreActions.setNotification('danger', yield translate(errorCode)))
	}

	function* deleteProfilePhotoAttempt(action) {
		const { media_id } = action
		const userId = yield select(getUserId)

		try {
			const response = yield call(api.deleteProfilePhoto, userId, media_id)

			if (response && response.ok && response.data && response.data.status === 'success') {
				const message = (response && response.data && response.data.message) || 'Photo deleted.'
				yield call(() => NavigationActions.pop({ popNum: 2 }))
				yield put(ProfileActions.deleteProfilePhotoSuccess(media_id, yield translate(message)))
			} else {
				const problem = (response && response.data && response.data.message)
					|| 'System error. Please try again later.'
				yield put(ProfileActions.deleteProfilePhotoFailure(yield translate(problem)))
			}
		} catch (err) {
			yield put(ProfileActions.deleteProfilePhotoFailure(err))
		}
	}

	function* deleteProfilePhotoSuccess(action) {
		const { message } = action
		yield put(CoreActions.setNotification('success', yield translate(message)))
	}

	function* deleteProfilePhotoFailure(action) {
		const { errorCode } = action
		yield put(CoreActions.setNotification('danger', yield translate(errorCode)))
	}

	// Load user video
	function* loadUserProfileVideoAttempt(action) {
		const { mediaId } = action
		const videos = yield select(getUserVideos)
		let video

		if (videos) {
			video = R.find(R.propEq('media_id', mediaId))(videos)
		}

		if (video) {
			yield put(ProfileActions.loadUserProfileVideoSuccess(video))
		} else {
			yield put(ProfileActions.unsetUserProfileVideo())
		}
	}

	// Load connection video
	function* loadConnectionProfileVideoAttempt(action) {
		const { mediaId } = action
		const videos = yield select(getConnectionVideos)
		let video

		if (videos) {
			video = R.find(R.propEq('media_id', mediaId))(videos)
		}

		if (video) {
			yield put(ProfileActions.loadConnectionProfileVideoSuccess(video))
			yield put(ProfileActions.viewConnectionProfileMediaAttempt(mediaId, video.type))
		} else {
			yield put(ProfileActions.unsetConnectionProfileVideo())
		}
	}

	// Add/Update/Delete video
	function* submitProfileVideoAttempt(action) {
		const { media_id, video } = action
		const userId = yield select(getUserId)

		try {
			let response
			if (media_id > 0) {
				response = yield call(api.updateProfileVideo, userId, media_id, video)
			} else {
				response = yield call(api.addProfileVideo, userId, video)
			}

			if (response && response.ok && response.data && response.data.status === 'success') {
				const message = (response && response.data && response.data.message) || 'Profile video updated.'
				yield call(NavigationActions.pop)
				if (media_id > 0) {
					yield put(ProfileActions.updateProfileVideoSuccess({ ...video, media_id }, yield translate(message)))
				} else {
					yield put(ProfileActions.addProfileVideoSuccess(response.data.data, yield translate(message)))
				}
			} else {
				const problem = (response && response.data && response.data.message)
					|| 'System error. Please try again later.'
				yield put(ProfileActions.submitProfileVideoFailure(yield translate(problem)))
			}
		} catch (err) {
			yield put(ProfileActions.submitProfileVideoFailure(err))
		}
	}

	function* addProfileVideoSuccess(action) {
		const { message } = action
		yield put(CoreActions.setNotification('success', yield translate(message)))
	}

	function* updateProfileVideoSuccess(action) {
		const { message } = action
		yield put(CoreActions.setNotification('success', yield translate(message)))
	}

	function* submitProfileVideoFailure(action) {
		const { errorCode } = action
		yield put(CoreActions.setNotification('danger', yield translate(errorCode)))
	}

	function* deleteProfileVideoAttempt(action) {
		const { media_id } = action
		const userId = yield select(getUserId)

		try {
			const response = yield call(api.deleteProfileVideo, userId, media_id)

			if (response && response.ok && response.data && response.data.status === 'success') {
				const message = (response && response.data && response.data.message) || 'Video deleted.'
				yield call(() => NavigationActions.pop({ popNum: 2 }))
				yield put(ProfileActions.deleteProfileVideoSuccess(media_id, yield translate(message)))
			} else {
				const problem = (response && response.data && response.data.message)
					|| 'System error. Please try again later.'
				yield put(ProfileActions.deleteProfileVideoFailure(yield translate(problem)))
			}
		} catch (err) {
			yield put(ProfileActions.deleteProfileVideoFailure(err))
		}
	}

	function* deleteProfileVideoSuccess(action) {
		const { message } = action
		yield put(CoreActions.setNotification('success', yield translate(message)))
	}

	function* deleteProfileVideoFailure(action) {
		const { errorCode } = action
		yield put(CoreActions.setNotification('danger', yield translate(errorCode)))
	}

	// View connection media
	function* viewConnectionProfileMediaAttempt(action) {
		const { mediaId, mediaType } = action
		const userId = yield select(getUserId)

		if (userId) {
			try {
				const response = yield call(api.viewMedia, userId, mediaId)

				if (response && response.ok && response.data && response.data.status === 'success') {
					if (mediaType === 'photo') {
						yield put(ProfileActions.viewConnectionProfilePhotoSuccess(mediaId))
					} else if (mediaType === 'video') {
						yield put(ProfileActions.viewConnectionProfileVideoSuccess(mediaId))
					}
				}
			} catch (err) {
				// TODO what now?
			}
		}
	}

	// Get user profile bio
	function* getUserProfileBioAttempt(action) {
		const { member_id } = action

		try {
			const response = yield call(api.getProfileBio, member_id)

			if (response && response.ok && response.data && response.data.status === 'success' && response.data.data) {
				yield put(ProfileActions.getUserProfileBioSuccess(response.data.data))
			} else {
				const problem = (response && response.data && response.data.message)
					|| 'System error. Please try again later.'
				yield put(ProfileActions.getUserProfileBioFailure(yield translate(problem)))
			}
		} catch (err) {
			yield put(ProfileActions.getUserProfileBioFailure(err))
		}
	}

	// Get connection profile bio
	function* getConnectionProfileBioAttempt(action) {
		const { member_id } = action

		try {
			const response = yield call(api.getProfileBio, member_id)

			if (response && response.ok && response.data && response.data.status === 'success' && response.data.data) {
				yield put(ProfileActions.getConnectionProfileBioSuccess(response.data.data))
			} else {
				const problem = (response && response.data && response.data.message)
					|| 'System error. Please try again later.'
				yield put(ProfileActions.getConnectionProfileBioFailure(yield translate(problem)))
			}
		} catch (err) {
			yield put(ProfileActions.getConnectionProfileBioFailure(err))
		}
	}

	// Add profile bio
	function* addProfileBioAttempt(action) {
		const { member_id, bio } = action

		try {
			const response = yield call(api.addProfileBio, member_id, bio)

			if (response && response.ok && response.data && response.data.status === 'success' && response.data.data) {
				const message = (response && response.data && response.data.message) || 'Profile updated.'
				yield call(NavigationActions.pop)
				yield put(ProfileActions.addProfileBioSuccess(response.data.data, message))
			} else {
				const problem = (response && response.data && response.data.message)
					|| 'System error. Please try again later.'
				yield put(ProfileActions.addProfileBioFailure(yield translate(problem)))
			}
		} catch (err) {
			yield put(ProfileActions.addProfileBioFailure(err))
		}
	}

	function* addProfileBioSuccess(action) {
		const { message } = action
		yield put(CoreActions.setNotification('success', yield translate(message)))
	}

	function* addProfileBioFailure(action) {
		const { errorCode } = action
		yield put(CoreActions.setNotification('danger', yield translate(errorCode)))
	}

	// Update profile bio
	function* updateProfileBioAttempt(action) {
		const { member_id, bio } = action

		try {
			const response = yield call(api.updateProfileBio, member_id, bio.member_bio_id, bio)

			if (response && response.ok && response.data && response.data.status === 'success' && response.data.data) {
				const message = (response && response.data && response.data.message) || 'Profile updated.'
				yield call(NavigationActions.pop)
				yield put(ProfileActions.updateProfileBioSuccess(response.data.data, message))
			} else {
				const problem = (response && response.data && response.data.message)
					|| 'System error. Please try again later.'
				yield put(ProfileActions.updateProfileBioFailure(yield translate(problem)))
			}
		} catch (err) {
			yield put(ProfileActions.updateProfileBioFailure(err))
		}
	}

	function* updateProfileBioSuccess(action) {
		const { message } = action
		yield put(CoreActions.setNotification('success', yield translate(message)))
	}

	function* updateProfileBioFailure(action) {
		const { errorCode } = action
		yield put(CoreActions.setNotification('danger', yield translate(errorCode)))
	}

	// Delete profile bio
	function* deleteProfileBioAttempt(action) {
		const { member_id, bio } = action

		try {
			const response = yield call(api.deleteProfileBio, member_id, bio.member_bio_id)

			if (response && response.ok && response.data && response.data.status === 'success') {
				const message = (response && response.data && response.data.message) || 'Profile updated.'
				yield call(NavigationActions.pop)
				yield put(ProfileActions.deleteProfileBioSuccess(bio, yield translate(message)))
			} else {
				const problem = (response && response.data && response.data.message)
					|| 'System error. Please try again later.'
				yield put(ProfileActions.deleteProfileBioFailure(yield translate(problem)))
			}
		} catch (err) {
			yield put(ProfileActions.deleteProfileBioFailure(err))
		}
	}

	function* deleteProfileBioSuccess(action) {
		const { message } = action
		yield put(CoreActions.setNotification('success', yield translate(message)))
	}

	function* deleteProfileBioFailure(action) {
		const { errorCode } = action
		yield put(CoreActions.setNotification('danger', yield translate(errorCode)))
	}

	// Get user profile references
	function* getUserProfileReferencesAttempt(action) {
		const { member_id } = action

		try {
			const response = yield call(api.getProfileReferences, member_id)

			if (response && response.ok && response.data && response.data.status === 'success' && response.data.data) {
				yield put(ProfileActions.getUserProfileReferencesSuccess(member_id, response.data.data))
			} else {
				const problem = (response && response.data && response.data.message)
					|| 'System error. Please try again later.'
				yield put(ProfileActions.getUserProfileReferencesFailure(yield translate(problem)))
			}
		} catch (err) {
			yield put(ProfileActions.getUserProfileReferencesFailure(err))
		}
	}

	// Get connection profile references
	function* getConnectionProfileReferencesAttempt(action) {
		const { member_id } = action

		try {
			const response = yield call(api.getProfileReferences, member_id)

			if (response && response.ok && response.data && response.data.status === 'success' && response.data.data) {
				yield put(ProfileActions.getConnectionProfileReferencesSuccess(member_id, response.data.data))
			} else {
				const problem = (response && response.data && response.data.message)
					|| 'System error. Please try again later.'
				yield put(ProfileActions.getConnectionProfileReferencesFailure(yield translate(problem)))
			}
		} catch (err) {
			yield put(ProfileActions.getConnectionProfileReferencesFailure(err))
		}
	}

	// Add profile reference
	function* addProfileReferenceAttempt(action) {
		const { receiver_id, reference } = action

		try {
			const response = yield call(api.addProfileReference, receiver_id, { reference })

			if (response && response.ok && response.data && response.data.status === 'success') {
				// const message = (response && response.data && response.data.message) || 'Reference submitted.'
				const message = 'Reference submitted.'
				yield call(NavigationActions.pop)
				yield put(ProfileActions.addProfileReferenceSuccess(yield translate(message)))
			} else {
				const problem = 'Reference was not submitted.'
				const errors = (response && response.data && response.data.data) || null
				yield put(ProfileActions.addProfileReferenceFailure(yield translate(problem), errors))
			}
		} catch (err) {
			yield put(ProfileActions.addProfileReferenceFailure(err, null))
		}
	}

	function* addProfileReferenceSuccess(action) {
		const { message } = action
		yield put(CoreActions.setNotification('success', yield translate(message)))
	}

	function* addProfileReferenceFailure(action) {
		const { errorCode } = action
		yield put(CoreActions.setNotification('danger', yield translate(errorCode)))
	}

	// Update profile reference
	function* updateProfileReferenceAttempt(action) {
		const { member_id, reference_id, status } = action

		try {
			const response = yield call(api.updateProfileReference, member_id, reference_id, { status })

			if (response && response.ok && response.data && response.data.status === 'success') {
				yield put(ProfileActions.updateProfileReferenceSuccess(reference_id, status))
			} else {
				const problem = (response && response.data && response.data.message) || 'Reference update failed.'
				yield put(ProfileActions.updateProfileReferenceFailure(reference_id, yield translate(problem)))
			}
		} catch (err) {
			yield put(ProfileActions.updateProfileReferenceFailure(reference_id, err))
		}
	}

	function* updateProfileReferenceFailure(action) {
		const { errorCode } = action
		yield put(CoreActions.setNotification('danger', yield translate(errorCode)))
	}


	// The Main Watcher function
	function* startWatchers() {
		yield fork(takeEvery, Type.GET_CONNECTION_PROFILE_ATTEMPT, getConnectionProfileAttempt)

		yield fork(takeEvery, Type.GET_USER_PROFILE_PHOTOS_ATTEMPT, getUserProfilePhotosAttempt)
		yield fork(takeEvery, Type.SEARCH_USER_PROFILE_PHOTOS_ATTEMPT, searchUserProfilePhotosAttempt)
		yield fork(takeEvery, Type.GET_CONNECTION_PROFILE_PHOTOS_ATTEMPT, getConnectionProfilePhotosAttempt)
		yield fork(takeEvery, Type.SEARCH_CONNECTION_PROFILE_PHOTOS_ATTEMPT, searchConnectionProfilePhotosAttempt)

		yield fork(takeEvery, Type.GET_USER_PROFILE_VIDEOS_ATTEMPT, getUserProfileVideosAttempt)
		yield fork(takeEvery, Type.SEARCH_USER_PROFILE_VIDEOS_ATTEMPT, searchUserProfileVideosAttempt)
		yield fork(takeEvery, Type.GET_CONNECTION_PROFILE_VIDEOS_ATTEMPT, getConnectionProfileVideosAttempt)
		yield fork(takeEvery, Type.SEARCH_CONNECTION_PROFILE_VIDEOS_ATTEMPT, searchConnectionProfileVideosAttempt)

		yield fork(takeEvery, Type.LOAD_USER_PROFILE_PHOTO_ATTEMPT, loadUserProfilePhotoAttempt)
		yield fork(takeEvery, Type.LOAD_CONNECTION_PROFILE_PHOTO_ATTEMPT, loadConnectionProfilePhotoAttempt)
		yield fork(takeEvery, Type.SUBMIT_PROFILE_PHOTO_ATTEMPT, submitProfilePhotoAttempt)
		yield fork(takeEvery, Type.ADD_PROFILE_PHOTO_SUCCESS, addProfilePhotoSuccess)
		yield fork(takeEvery, Type.UPDATE_PROFILE_PHOTO_SUCCESS, updateProfilePhotoSuccess)
		yield fork(takeEvery, Type.SUBMIT_PROFILE_PHOTO_FAILURE, submitProfilePhotoFailure)
		yield fork(takeEvery, Type.DELETE_PROFILE_PHOTO_ATTEMPT, deleteProfilePhotoAttempt)
		yield fork(takeEvery, Type.DELETE_PROFILE_PHOTO_SUCCESS, deleteProfilePhotoSuccess)
		yield fork(takeEvery, Type.DELETE_PROFILE_PHOTO_FAILURE, deleteProfilePhotoFailure)

		yield fork(takeEvery, Type.LOAD_USER_PROFILE_VIDEO_ATTEMPT, loadUserProfileVideoAttempt)
		yield fork(takeEvery, Type.LOAD_CONNECTION_PROFILE_VIDEO_ATTEMPT, loadConnectionProfileVideoAttempt)
		yield fork(takeEvery, Type.SUBMIT_PROFILE_VIDEO_ATTEMPT, submitProfileVideoAttempt)
		yield fork(takeEvery, Type.ADD_PROFILE_VIDEO_SUCCESS, addProfileVideoSuccess)
		yield fork(takeEvery, Type.UPDATE_PROFILE_VIDEO_SUCCESS, updateProfileVideoSuccess)
		yield fork(takeEvery, Type.SUBMIT_PROFILE_VIDEO_FAILURE, submitProfileVideoFailure)
		yield fork(takeEvery, Type.DELETE_PROFILE_VIDEO_ATTEMPT, deleteProfileVideoAttempt)
		yield fork(takeEvery, Type.DELETE_PROFILE_VIDEO_SUCCESS, deleteProfileVideoSuccess)
		yield fork(takeEvery, Type.DELETE_PROFILE_VIDEO_FAILURE, deleteProfileVideoFailure)

		yield fork(takeEvery, Type.VIEW_CONNECTION_PROFILE_MEDIA_ATTEMPT, viewConnectionProfileMediaAttempt)

		yield fork(takeEvery, Type.GET_USER_PROFILE_BIO_ATTEMPT, getUserProfileBioAttempt)
		yield fork(takeEvery, Type.GET_CONNECTION_PROFILE_BIO_ATTEMPT, getConnectionProfileBioAttempt)
		yield fork(takeEvery, Type.ADD_PROFILE_BIO_ATTEMPT, addProfileBioAttempt)
		yield fork(takeEvery, Type.ADD_PROFILE_BIO_SUCCESS, addProfileBioSuccess)
		yield fork(takeEvery, Type.ADD_PROFILE_BIO_FAILURE, addProfileBioFailure)
		yield fork(takeEvery, Type.UPDATE_PROFILE_BIO_ATTEMPT, updateProfileBioAttempt)
		yield fork(takeEvery, Type.UPDATE_PROFILE_BIO_SUCCESS, updateProfileBioSuccess)
		yield fork(takeEvery, Type.UPDATE_PROFILE_BIO_FAILURE, updateProfileBioFailure)
		yield fork(takeEvery, Type.DELETE_PROFILE_BIO_ATTEMPT, deleteProfileBioAttempt)
		yield fork(takeEvery, Type.DELETE_PROFILE_BIO_SUCCESS, deleteProfileBioSuccess)
		yield fork(takeEvery, Type.DELETE_PROFILE_BIO_FAILURE, deleteProfileBioFailure)

		yield fork(takeEvery, Type.GET_USER_PROFILE_REFERENCES_ATTEMPT, getUserProfileReferencesAttempt)
		yield fork(takeEvery, Type.GET_CONNECTION_PROFILE_REFERENCES_ATTEMPT, getConnectionProfileReferencesAttempt)
		yield fork(takeEvery, Type.ADD_PROFILE_REFERENCE_ATTEMPT, addProfileReferenceAttempt)
		yield fork(takeEvery, Type.ADD_PROFILE_REFERENCE_SUCCESS, addProfileReferenceSuccess)
		yield fork(takeEvery, Type.ADD_PROFILE_REFERENCE_FAILURE, addProfileReferenceFailure)
		yield fork(takeEvery, Type.UPDATE_PROFILE_REFERENCE_ATTEMPT, updateProfileReferenceAttempt)
		yield fork(takeEvery, Type.UPDATE_PROFILE_REFERENCE_FAILURE, updateProfileReferenceFailure)
	}

	return {
		startWatchers,
	}
}
