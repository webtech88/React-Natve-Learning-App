import { actionTypes as ReduxFormType } from 'redux-form'
import Immutable from 'seamless-immutable'
import R from 'ramda'
import { createReducer } from 'reduxsauce'
import { REHYDRATE } from 'redux-persist/constants'

import Type from '../actions/type'
import CoreActionsType from '../../core/actions/type'

export const INITIAL_STATE = Immutable({
	// User profile
	showreelOpen: true,
	gettingPhotos: false,
	photos: null,
	photosSearchResults: [],
	loadingPhoto: false,
	photo: null,
	submittingPhoto: false,
	deletingPhoto: false,
	gettingVideos: false,
	videos: null,
	videosSearchResults: [],
	loadingVideo: false,
	video: null,
	submittingVideo: false,
	deletingVideo: false,
	gettingBio: false,
	submittingBio: false,
	experience: null,
	education: null,
	gettingReferences: false,
	submittingReference: false,
	receivedReferences: null,
	givenReferences: null,
	errorCode: null,
	errors: null,
	connectionProfile: {
		showreelOpen: true,
		gettingProfile: false,
		data: null,
		currentQualification: {},
		gettingPhotos: false,
		photos: null,
		photosSearchResults: [],
		loadingPhoto: false,
		photo: null,
		gettingVideos: false,
		videos: null,
		videosSearchResults: [],
		loadingVideo: false,
		video: null,
		gettingBio: false,
		experience: null,
		education: null,
		gettingReferences: false,
		submittingReference: false,
		receivedReferences: null,
		givenReferences: null,
		errorCode: null,
		errors: null,
	},
})


const toggleUserProfileShowreel = (state, action) => state.merge({ showreelOpen: action.open })

const toggleConnectionProfileShowreel = (state, action) => state.merge({
	connectionProfile: {
		...state.connectionProfile,
		showreelOpen: action.open,
	},
})

const getConnectionProfileAttempt = state => state.merge({
	connectionProfile: {
		...state.connectionProfile,
		gettingProfile: true,
		errorCode: null,
		errors: null,
	},
})

const getConnectionProfileSuccess = (state, { profile }) => {
	const data = {
		...state.connectionProfile.data,
		...R.omit(['current_qualification', 'centres', 'notifications_counts', 'sectors'], profile),
	}

	return state.merge({
		connectionProfile: {
			...state.connectionProfile,
			gettingProfile: false,
			data,
			currentQualification: profile.current_qualification,
			errorCode: null,
			errors: null,
		},
	})
}

const getConnectionProfileFailure = (state, action) => state.merge({
	connectionProfile: {
		...state.connectionProfile,
		gettingProfile: false,
		errorCode: action.errorCode,
		errors: null,
	},
})

const unsetConnectionProfile = state => state.merge({ connectionProfile: INITIAL_STATE.connectionProfile })


const getUserProfilePhotosAttempt = state =>
	state.merge({ gettingPhotos: true, errorCode: null, errors: null })

const getUserProfilePhotosSuccess = (state, action) => {
	const { photos } = action
	return state.merge({ gettingPhotos: false, photos, errorCode: null, errors: null })
}

const getUserProfilePhotosFailure = (state, action) =>
	state.merge({ gettingPhotos: false, errorCode: action.errorCode, errors: null })

const searchUserProfilePhotosSuccess = (state, action) =>
	state.merge({ photosSearchResults: action.results })

const clearUserProfilePhotosSearch = state => state.merge({ photosSearchResults: [] })


const getConnectionProfilePhotosAttempt = state => state.merge({
	connectionProfile: {
		...state.connectionProfile,
		gettingPhotos: true,
		errorCode: null,
		errors: null,
	},
})

const getConnectionProfilePhotosSuccess = (state, action) => state.merge({
	connectionProfile: {
		...state.connectionProfile,
		gettingPhotos: false,
		photos: action.photos,
		errorCode: null,
		errors: null,
	},
})

const getConnectionProfilePhotosFailure = (state, action) => state.merge({
	connectionProfile: {
		...state.connectionProfile,
		gettingPhotos: false,
		errorCode: action.errorCode,
		errors: null,
	},
})

const searchConnectionProfilePhotosSuccess = (state, action) => state.merge({
	connectionProfile: {
		...state.connectionProfile,
		photosSearchResults: action.results,
	},
})

const clearConnectionProfilePhotosSearch = state => state.merge({
	connectionProfile: {
		...state.connectionProfile,
		photosSearchResults: [],
	},
})


const getUserProfileVideosAttempt = state =>
	state.merge({ gettingVideos: true, errorCode: null, errors: null })

const getUserProfileVideosSuccess = (state, action) => {
	const { videos } = action
	return state.merge({ gettingVideos: false, videos, errorCode: null, errors: null })
}

const getUserProfileVideosFailure = (state, action) =>
	state.merge({ gettingVideos: false, errorCode: action.errorCode, errors: null })

const searchUserProfileVideosSuccess = (state, action) =>
	state.merge({ videosSearchResults: action.results })

const clearUserProfileVideosSearch = state => state.merge({ videosSearchResults: [] })


const getConnectionProfileVideosAttempt = state => state.merge({
	connectionProfile: {
		...state.connectionProfile,
		gettingVideos: true,
		errorCode: null,
		errors: null,
	},
})

const getConnectionProfileVideosSuccess = (state, action) => state.merge({
	connectionProfile: {
		...state.connectionProfile,
		gettingVideos: false,
		videos: action.videos,
		errorCode: null,
		errors: null,
	},
})

const getConnectionProfileVideosFailure = (state, action) => state.merge({
	connectionProfile: {
		...state.connectionProfile,
		gettingVideos: false,
		errorCode: action.errorCode,
		errors: null,
	},
})

const searchConnectionProfileVideosSuccess = (state, action) => state.merge({
	connectionProfile: {
		...state.connectionProfile,
		videosSearchResults: action.results,
	},
})

const clearConnectionProfileVideosSearch = state => state.merge({
	connectionProfile: {
		...state.connectionProfile,
		videosSearchResults: [],
	},
})


const loadUserProfilePhotoAttempt = state => state.merge({ loadingPhoto: true, photo: null })

const loadUserProfilePhotoSuccess = (state, action) => state.merge({ loadingPhoto: false, photo: action.photo })

const unsetUserProfilePhoto = state => state.merge({ loadingPhoto: false, photo: null })

const submitProfilePhotoAttempt = state => state.merge({ submittingPhoto: true, errorCode: null })

const addProfilePhotoSuccess = (state, action) =>
	state.merge({ submittingPhoto: false, photos: [action.photo, ...state.photos], errorCode: null })

const updateProfilePhotoSuccess = (state, action) => {
	let newPhotos = state.photos
	let newPhoto = state.photo

	newPhotos = newPhotos.map((photo) => {
		if (photo.media_id === action.photo.media_id) {
			const updatedPhoto = Object.assign({}, photo, action.photo)
			if (newPhoto) newPhoto = updatedPhoto
			return updatedPhoto
		}

		return photo
	})

	return state.merge({ submittingPhoto: false, photos: newPhotos, photo: newPhoto, errorCode: null })
}

const submitProfilePhotoFailure = (state, action) =>
	state.merge({ submittingPhoto: false, errorCode: action.errorCode })

const deleteProfilePhotoAttempt = state => state.merge({ deletingPhoto: true, errorCode: null })

const deleteProfilePhotoSuccess = (state, action) => {
	const { photos } = state
	let newPhotos = photos

	photos.every((photo, index) => {
		if (photo.media_id === action.media_id) {
			newPhotos = [
				...photos.slice(0, index),
				...photos.slice(index + 1),
			]

			return false
		}

		return photo
	})

	return state.merge({ deletingPhoto: false, photos: newPhotos, photo: null, errorCode: null })
}

const deleteProfilePhotoFailure = (state, action) =>
	state.merge({ deletingPhoto: false, errorCode: action.errorCode })


const loadConnectionProfilePhotoAttempt = state => state.merge({
	connectionProfile: {
		...state.connectionProfile,
		loadingPhoto: true,
		photo: null,
	},
})

const loadConnectionProfilePhotoSuccess = (state, action) => state.merge({
	connectionProfile: {
		...state.connectionProfile,
		loadingPhoto: false,
		photo: action.photo,
	},
})

const unsetConnectionProfilePhoto = state => state.merge({
	connectionProfile: {
		...state.connectionProfile,
		loadingPhoto: false,
		photo: null,
	},
})


const loadUserProfileVideoAttempt = state => state.merge({ loadingVideo: true, video: null })

const loadUserProfileVideoSuccess = (state, action) => state.merge({ loadingVideo: false, video: action.video })

const unsetUserProfileVideo = state => state.merge({ loadingVideo: false, video: null })

const submitProfileVideoAttempt = state => state.merge({ submittingVideo: true, errorCode: null })

const addProfileVideoSuccess = (state, action) =>
	state.merge({ submittingVideo: false, videos: [action.video, ...state.videos], errorCode: null })

const updateProfileVideoSuccess = (state, action) => {
	let newVideos = state.videos
	let newVideo = state.video

	newVideos = newVideos.map((video) => {
		if (video.media_id === action.video.media_id) {
			const updatedVideo = Object.assign({}, video, action.video)
			if (newVideo) newVideo = updatedVideo
			return updatedVideo
		}

		return video
	})

	return state.merge({ submittingVideo: false, videos: newVideos, video: newVideo, errorCode: null })
}

const submitProfileVideoFailure = (state, action) =>
	state.merge({ submittingVideo: false, errorCode: action.errorCode })

const deleteProfileVideoAttempt = state => state.merge({ deletingVideo: true, errorCode: null })

const deleteProfileVideoSuccess = (state, action) => {
	const { videos } = state
	let newVideos = videos

	videos.every((video, index) => {
		if (video.media_id === action.media_id) {
			newVideos = [
				...videos.slice(0, index),
				...videos.slice(index + 1),
			]

			return false
		}

		return video
	})

	return state.merge({ deletingVideo: false, videos: newVideos, video: null, errorCode: null })
}

const deleteProfileVideoFailure = (state, action) =>
	state.merge({ deletingVideo: false, errorCode: action.errorCode })


const loadConnectionProfileVideoAttempt = state => state.merge({
	connectionProfile: {
		...state.connectionProfile,
		loadingVideo: true,
		video: null,
	},
})

const loadConnectionProfileVideoSuccess = (state, action) => state.merge({
	connectionProfile: {
		...state.connectionProfile,
		loadingVideo: false,
		video: action.video,
	},
})

const unsetConnectionProfileVideo = state => state.merge({
	connectionProfile: {
		...state.connectionProfile,
		loadingVideo: false,
		video: null,
	},
})


const viewConnectionProfileVideoSuccess = (state, action) => {
	const { mediaId } = action
	let newVideos = state.connectionProfile.videos
	let newVideo = state.connectionProfile.video

	newVideos = newVideos.map((video) => {
		if (video.media_id === mediaId) {
			const updatedVideo = { ...video, viewed: video.viewed + 1 }
			if (newVideo) newVideo = updatedVideo
			return updatedVideo
		}

		return video
	})

	return state.merge({
		connectionProfile: {
			...state.connectionProfile,
			videos: newVideos,
			video: newVideo,
		},
	})
}

const viewConnectionProfilePhotoSuccess = (state, action) => {
	const { mediaId } = action
	let newPhotos = state.connectionProfile.photos
	let newPhoto = state.connectionProfile.photo

	newPhotos = newPhotos.map((photo) => {
		if (photo.media_id === mediaId) {
			const updatedPhoto = { ...photo, viewed: photo.viewed + 1 }
			if (newPhoto) newPhoto = updatedPhoto
			return updatedPhoto
		}

		return photo
	})

	return state.merge({
		connectionProfile: {
			...state.connectionProfile,
			photos: newPhotos,
			photo: newPhoto,
		},
	})
}


const getUserProfileBioAttempt = state => state.merge({ gettingBio: true, errorCode: null, errors: null })

const getUserProfileBioSuccess = (state, action) => {
	const { bio } = action
	let experience = []
	let education = []

	if (bio && bio.experience) experience = bio.experience
	if (bio && bio.education) education = bio.education

	return state.merge({ gettingBio: false, experience, education, errorCode: null, errors: null })
}

const getUserProfileBioFailure = (state, action) =>
	state.merge({ gettingBio: false, errorCode: action.errorCode, errors: null })

const getConnectionProfileBioAttempt = state => state.merge({
	connectionProfile: {
		...state.connectionProfile,
		gettingBio: true,
		errorCode: null,
		errors: null,
	},
})

const getConnectionProfileBioSuccess = (state, action) => {
	const { bio } = action
	let experience = []
	let education = []

	if (bio && bio.experience) experience = bio.experience
	if (bio && bio.education) education = bio.education

	return state.merge({
		connectionProfile: {
			...state.connectionProfile,
			gettingBio: false,
			experience,
			education,
			errorCode: null,
			errors: null,
		},
	})
}

const getConnectionProfileBioFailure = (state, action) => state.merge({
	connectionProfile: {
		...state.connectionProfile,
		gettingBio: false,
		errorCode: action.errorCode,
		errors: null,
	},
})


const addProfileBioAttempt = state =>
	state.merge({ submittingBio: true, errorCode: null, errors: null })

const addProfileBioSuccess = (state, action) => {
	const { bio } = action
	let updatedBio

	if (bio.type === 'experience') {
		const experience = R.sortBy(R.prop('from_date'))([...state.experience, bio])
		updatedBio = { experience: R.reverse(experience) }
	} else if (bio.type === 'education') {
		const education = R.sortBy(R.prop('from_date'))([...state.education, bio])
		updatedBio = { education: R.reverse(education) }
	}

	return state.merge({ submittingBio: false, ...updatedBio, errorCode: null, errors: null })
}

const addProfileBioFailure = (state, action) =>
	state.merge({ submittingBio: false, errorCode: action.errorCode, errors: null })


const updateProfileBioAttempt = state =>
	state.merge({ submittingBio: true, errorCode: null, errors: null })

const updateProfileBioSuccess = (state, action) => {
	const { bio } = action
	let updatedBio

	if (bio.type === 'experience') {
		const { experience } = state
		let experienceIndex = null

		// find where is the experience
		experience.every((experience, index) => {
			if (experience.member_bio_id === bio.member_bio_id) {
				// continue once we have found where is the experience
				experienceIndex = index
				return false
			}

			return experience
		})

		// update experience
		if (experienceIndex !== null && experience && experience[experienceIndex]) {
			const updatedExperience = R.sortBy(R.prop('from_date'))([
				...experience.slice(0, experienceIndex),
				{
					...bio,
				},
				...experience.slice(experienceIndex + 1),
			])

			updatedBio = { experience: R.reverse(updatedExperience) }
		}
	} else if (bio.type === 'education') {
		const { education } = state
		let educationIndex = null

		// find where is the education
		education.every((education, index) => {
			if (education.member_bio_id === bio.member_bio_id) {
				// continue once we have found where is the education
				educationIndex = index
				return false
			}

			return education
		})

		// update education
		if (educationIndex !== null && education && education[educationIndex]) {
			const updatedEducation = R.sortBy(R.prop('from_date'))([
				...education.slice(0, educationIndex),
				{
					...bio,
				},
				...education.slice(educationIndex + 1),
			])

			updatedBio = { education: R.reverse(updatedEducation) }
		}
	}

	return state.merge({ submittingBio: false, ...updatedBio, errorCode: null, errors: null })
}

const updateProfileBioFailure = (state, action) =>
	state.merge({ submittingBio: false, errorCode: action.errorCode, errors: null })


const deleteProfileBioAttempt = state => state.merge({ errorCode: null, errors: null })

const deleteProfileBioSuccess = (state, action) => {
	const { bio } = action
	let updatedBio
	let updatedExperience = state.experience
	let updatedEducation = state.education

	if (bio.type === 'experience') {
		updatedExperience.every((experience, index) => {
			if (experience.member_bio_id === bio.member_bio_id) {
				updatedExperience = [
					...updatedExperience.slice(0, index),
					...updatedExperience.slice(index + 1),
				]

				return false
			}

			return experience
		})

		updatedBio = { experience: updatedExperience }
	} else if (bio.type === 'education') {
		updatedEducation.every((education, index) => {
			if (education.member_bio_id === bio.member_bio_id) {
				updatedEducation = [
					...updatedEducation.slice(0, index),
					...updatedEducation.slice(index + 1),
				]

				return false
			}

			return education
		})

		updatedBio = { education: updatedEducation }
	}

	return state.merge({ ...updatedBio, errorCode: null, errors: null })
}

const deleteProfileBioFailure = (state, action) => state.merge({ errorCode: action.errorCode, errors: null })


const getUserProfileReferenceAttempt = state =>
	state.merge({ gettingReferences: true, errorCode: null, errors: null })

const getUserProfileReferencesSuccess = (state, action) => {
	const { member_id, references } = action
	const setReceivedReferences = R.filter(n => (n.sender_id !== member_id), references)
	const givenReferences = R.filter(n => (n.sender_id === member_id), references)

	const receivedReferences = setReceivedReferences.map(reference => ({
		...reference,
		updatingReference: false,
	}))

	return state.merge({ gettingReferences: false, receivedReferences, givenReferences, errorCode: null, errors: null })
}

const getUserProfileReferencesFailure = (state, action) =>
	state.merge({ gettingReferences: false, errorCode: action.errorCode, errors: null })

const getConnectionProfileReferenceAttempt = state => state.merge({
	connectionProfile: {
		...state.connectionProfile,
		gettingReferences: true,
		errorCode: null,
		errors: null,
	},
})

const getConnectionProfileReferencesSuccess = (state, action) => {
	const { member_id, references } = action
	const receivedReferences = R.filter(n => (n.sender_id !== member_id), references)
	const givenReferences = R.filter(n => (n.sender_id === member_id), references)

	return state.merge({
		connectionProfile: {
			...state.connectionProfile,
			gettingReferences: false,
			receivedReferences,
			givenReferences,
			errorCode: null,
			errors: null,
		},
	})
}

const getConnectionProfileReferencesFailure = (state, action) => state.merge({
	connectionProfile: {
		...state.connectionProfile,
		gettingReferences: false,
		errorCode: action.errorCode,
		errors: null,
	},
})

const addProfileReferenceAttempt = state => state.merge({
	connectionProfile: {
		...state.connectionProfile,
		submittingReference: true,
		errorCode: null,
		errors: null,
	},
})

const addProfileReferenceSuccess = state => state.merge({
	connectionProfile: {
		...state.connectionProfile,
		submittingReference: false,
		errorCode: null,
		errors: null,
	},
})

const addProfileReferenceFailure = (state, action) => state.merge({
	connectionProfile: {
		...state.connectionProfile,
		submittingReference: false,
		errorCode: action.errorCode,
		errors: action.errors,
	},
})

const updateProfileReferenceAttempt = (state, action) => {
	const { reference_id } = action
	const references = state.receivedReferences
	let receivedReferences = references

	const referenceIndex = R.findIndex(R.propEq('reference_id', reference_id))(references)

	// update reference
	if (referenceIndex !== undefined && references && references[referenceIndex]) {
		receivedReferences = [
			...references.slice(0, referenceIndex),
			{
				...references[referenceIndex],
				updatingReference: true,
			},
			...references.slice(referenceIndex + 1),
		]
	}

	return state.merge({ receivedReferences, errorCode: null, errors: null })
}

const updateProfileReferenceSuccess = (state, action) => {
	const { reference_id, status } = action
	const references = state.receivedReferences
	let receivedReferences = references

	const referenceIndex = R.findIndex(R.propEq('reference_id', reference_id))(references)

	// update reference
	if (referenceIndex !== undefined && references && references[referenceIndex]) {
		receivedReferences = [
			...references.slice(0, referenceIndex),
			{
				...references[referenceIndex],
				status,
				updatingReference: false,
			},
			...references.slice(referenceIndex + 1),
		]
	}

	return state.merge({ receivedReferences, errorCode: null, errors: null })
}

const updateProfileReferenceFailure = (state, action) => {
	const { reference_id, errorCode } = action
	const references = state.receivedReferences
	let receivedReferences = references

	const referenceIndex = R.findIndex(R.propEq('reference_id', reference_id))(references)

	// update reference
	if (referenceIndex !== null && references && references[referenceIndex]) {
		receivedReferences = [
			...references.slice(0, referenceIndex),
			{
				...references[referenceIndex],
				updatingReference: false,
			},
			...references.slice(referenceIndex + 1),
		]
	}

	return state.merge({ receivedReferences, errorCode, errors: null })
}


// Reset
const rehydrate = (state, action) => {
	const persistedProfile = action.payload.profile

	if (persistedProfile) {
		return persistedProfile.merge({
			gettingPhotos: false,
			photosSearchResults: [],
			loadingPhoto: false,
			photo: null,
			submittingPhoto: false,
			deletingPhoto: false,
			gettingVideos: false,
			videosSearchResults: [],
			loadingVideo: false,
			video: null,
			submittingVideo: false,
			deletingVideo: false,
			gettingBio: false,
			submittingBio: false,
			gettingReferences: false,
			submittingReference: false,
			errorCode: null,
			errors: null,
			connectionProfile: INITIAL_STATE.connectionProfile,
		})
	}

	return state
}

const resetErrors = state => state.merge({ errorCode: null, errors: null })

const reset = () => INITIAL_STATE


// map our types to our handlers
const ACTION_HANDLERS = {
	// Profile
	[Type.TOGGLE_USER_PROFILE_SHOWREEL]: toggleUserProfileShowreel,
	[Type.TOGGLE_CONNECTION_PROFILE_SHOWREEL]: toggleConnectionProfileShowreel,
	[Type.GET_CONNECTION_PROFILE_ATTEMPT]: getConnectionProfileAttempt,
	[Type.GET_CONNECTION_PROFILE_SUCCESS]: getConnectionProfileSuccess,
	[Type.GET_CONNECTION_PROFILE_FAILURE]: getConnectionProfileFailure,
	[Type.UNSET_CONNECTION_PROFILE]: unsetConnectionProfile,
	// Photos
	[Type.GET_USER_PROFILE_PHOTOS_ATTEMPT]: getUserProfilePhotosAttempt,
	[Type.GET_USER_PROFILE_PHOTOS_SUCCESS]: getUserProfilePhotosSuccess,
	[Type.GET_USER_PROFILE_PHOTOS_FAILURE]: getUserProfilePhotosFailure,
	[Type.SEARCH_USER_PROFILE_PHOTOS_SUCCESS]: searchUserProfilePhotosSuccess,
	[Type.CLEAR_USER_PROFILE_PHOTOS_SEARCH]: clearUserProfilePhotosSearch,
	[Type.GET_CONNECTION_PROFILE_PHOTOS_ATTEMPT]: getConnectionProfilePhotosAttempt,
	[Type.GET_CONNECTION_PROFILE_PHOTOS_SUCCESS]: getConnectionProfilePhotosSuccess,
	[Type.GET_CONNECTION_PROFILE_PHOTOS_FAILURE]: getConnectionProfilePhotosFailure,
	[Type.SEARCH_CONNECTION_PROFILE_PHOTOS_SUCCESS]: searchConnectionProfilePhotosSuccess,
	[Type.CLEAR_CONNECTION_PROFILE_PHOTOS_SEARCH]: clearConnectionProfilePhotosSearch,
	// Videos
	[Type.GET_USER_PROFILE_VIDEOS_ATTEMPT]: getUserProfileVideosAttempt,
	[Type.GET_USER_PROFILE_VIDEOS_SUCCESS]: getUserProfileVideosSuccess,
	[Type.GET_USER_PROFILE_VIDEOS_FAILURE]: getUserProfileVideosFailure,
	[Type.SEARCH_USER_PROFILE_VIDEOS_SUCCESS]: searchUserProfileVideosSuccess,
	[Type.CLEAR_USER_PROFILE_VIDEOS_SEARCH]: clearUserProfileVideosSearch,
	[Type.GET_CONNECTION_PROFILE_VIDEOS_ATTEMPT]: getConnectionProfileVideosAttempt,
	[Type.GET_CONNECTION_PROFILE_VIDEOS_SUCCESS]: getConnectionProfileVideosSuccess,
	[Type.GET_CONNECTION_PROFILE_VIDEOS_FAILURE]: getConnectionProfileVideosFailure,
	[Type.SEARCH_CONNECTION_PROFILE_VIDEOS_SUCCESS]: searchConnectionProfileVideosSuccess,
	[Type.CLEAR_CONNECTION_PROFILE_VIDEOS_SEARCH]: clearConnectionProfileVideosSearch,
	// Photo & Video
	[Type.LOAD_USER_PROFILE_PHOTO_ATTEMPT]: loadUserProfilePhotoAttempt,
	[Type.LOAD_USER_PROFILE_PHOTO_SUCCESS]: loadUserProfilePhotoSuccess,
	[Type.UNSET_USER_PROFILE_PHOTO]: unsetUserProfilePhoto,
	[Type.LOAD_CONNECTION_PROFILE_PHOTO_ATTEMPT]: loadConnectionProfilePhotoAttempt,
	[Type.LOAD_CONNECTION_PROFILE_PHOTO_SUCCESS]: loadConnectionProfilePhotoSuccess,
	[Type.UNSET_CONNECTION_PROFILE_PHOTO]: unsetConnectionProfilePhoto,
	[Type.SUBMIT_PROFILE_PHOTO_ATTEMPT]: submitProfilePhotoAttempt,
	[Type.ADD_PROFILE_PHOTO_SUCCESS]: addProfilePhotoSuccess,
	[Type.UPDATE_PROFILE_PHOTO_SUCCESS]: updateProfilePhotoSuccess,
	[Type.SUBMIT_PROFILE_PHOTO_FAILURE]: submitProfilePhotoFailure,
	[Type.DELETE_PROFILE_PHOTO_ATTEMPT]: deleteProfilePhotoAttempt,
	[Type.DELETE_PROFILE_PHOTO_SUCCESS]: deleteProfilePhotoSuccess,
	[Type.DELETE_PROFILE_PHOTO_FAILURE]: deleteProfilePhotoFailure,
	[Type.LOAD_USER_PROFILE_VIDEO_ATTEMPT]: loadUserProfileVideoAttempt,
	[Type.LOAD_USER_PROFILE_VIDEO_SUCCESS]: loadUserProfileVideoSuccess,
	[Type.UNSET_USER_PROFILE_VIDEO]: unsetUserProfileVideo,
	[Type.SUBMIT_PROFILE_VIDEO_ATTEMPT]: submitProfileVideoAttempt,
	[Type.ADD_PROFILE_VIDEO_SUCCESS]: addProfileVideoSuccess,
	[Type.UPDATE_PROFILE_VIDEO_SUCCESS]: updateProfileVideoSuccess,
	[Type.SUBMIT_PROFILE_VIDEO_FAILURE]: submitProfileVideoFailure,
	[Type.DELETE_PROFILE_VIDEO_ATTEMPT]: deleteProfileVideoAttempt,
	[Type.DELETE_PROFILE_VIDEO_SUCCESS]: deleteProfileVideoSuccess,
	[Type.DELETE_PROFILE_VIDEO_FAILURE]: deleteProfileVideoFailure,
	[Type.LOAD_CONNECTION_PROFILE_VIDEO_ATTEMPT]: loadConnectionProfileVideoAttempt,
	[Type.LOAD_CONNECTION_PROFILE_VIDEO_SUCCESS]: loadConnectionProfileVideoSuccess,
	[Type.UNSET_CONNECTION_PROFILE_VIDEO]: unsetConnectionProfileVideo,
	[Type.VIEW_CONNECTION_PROFILE_VIDEO_SUCCESS]: viewConnectionProfileVideoSuccess,
	[Type.VIEW_CONNECTION_PROFILE_PHOTO_SUCCESS]: viewConnectionProfilePhotoSuccess,
	// Experience & Education (Bio)
	[Type.GET_USER_PROFILE_BIO_ATTEMPT]: getUserProfileBioAttempt,
	[Type.GET_USER_PROFILE_BIO_SUCCESS]: getUserProfileBioSuccess,
	[Type.GET_USER_PROFILE_BIO_FAILURE]: getUserProfileBioFailure,
	[Type.GET_CONNECTION_PROFILE_BIO_ATTEMPT]: getConnectionProfileBioAttempt,
	[Type.GET_CONNECTION_PROFILE_BIO_SUCCESS]: getConnectionProfileBioSuccess,
	[Type.GET_CONNECTION_PROFILE_BIO_FAILURE]: getConnectionProfileBioFailure,
	[Type.ADD_PROFILE_BIO_ATTEMPT]: addProfileBioAttempt,
	[Type.ADD_PROFILE_BIO_SUCCESS]: addProfileBioSuccess,
	[Type.ADD_PROFILE_BIO_FAILURE]: addProfileBioFailure,
	[Type.UPDATE_PROFILE_BIO_ATTEMPT]: updateProfileBioAttempt,
	[Type.UPDATE_PROFILE_BIO_SUCCESS]: updateProfileBioSuccess,
	[Type.UPDATE_PROFILE_BIO_FAILURE]: updateProfileBioFailure,
	[Type.DELETE_PROFILE_BIO_ATTEMPT]: deleteProfileBioAttempt,
	[Type.DELETE_PROFILE_BIO_SUCCESS]: deleteProfileBioSuccess,
	[Type.DELETE_PROFILE_BIO_FAILURE]: deleteProfileBioFailure,
	// References
	[Type.GET_USER_PROFILE_REFERENCES_ATTEMPT]: getUserProfileReferenceAttempt,
	[Type.GET_USER_PROFILE_REFERENCES_SUCCESS]: getUserProfileReferencesSuccess,
	[Type.GET_USER_PROFILE_REFERENCES_FAILURE]: getUserProfileReferencesFailure,
	[Type.GET_CONNECTION_PROFILE_REFERENCES_ATTEMPT]: getConnectionProfileReferenceAttempt,
	[Type.GET_CONNECTION_PROFILE_REFERENCES_SUCCESS]: getConnectionProfileReferencesSuccess,
	[Type.GET_CONNECTION_PROFILE_REFERENCES_FAILURE]: getConnectionProfileReferencesFailure,
	[Type.ADD_PROFILE_REFERENCE_ATTEMPT]: addProfileReferenceAttempt,
	[Type.ADD_PROFILE_REFERENCE_SUCCESS]: addProfileReferenceSuccess,
	[Type.ADD_PROFILE_REFERENCE_FAILURE]: addProfileReferenceFailure,
	[Type.UPDATE_PROFILE_REFERENCE_ATTEMPT]: updateProfileReferenceAttempt,
	[Type.UPDATE_PROFILE_REFERENCE_SUCCESS]: updateProfileReferenceSuccess,
	[Type.UPDATE_PROFILE_REFERENCE_FAILURE]: updateProfileReferenceFailure,
	// Reset
	[REHYDRATE]: rehydrate,
	[ReduxFormType.CHANGE]: resetErrors,
	[CoreActionsType.APP_RESET_ATTEMPT]: reset,
}

export default createReducer(INITIAL_STATE, ACTION_HANDLERS)
