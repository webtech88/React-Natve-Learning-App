import Type from './type'


const toggleUserProfileShowreel = open => ({ type: Type.TOGGLE_USER_PROFILE_SHOWREEL, open })
const toggleConnectionProfileShowreel = open => ({ type: Type.TOGGLE_CONNECTION_PROFILE_SHOWREEL, open })

const getConnectionProfileAttempt = member_id => ({ type: Type.GET_CONNECTION_PROFILE_ATTEMPT, member_id })
const getConnectionProfileSuccess = profile => ({ type: Type.GET_CONNECTION_PROFILE_SUCCESS, profile })
const getConnectionProfileFailure = errorCode => ({ type: Type.GET_CONNECTION_PROFILE_FAILURE, errorCode })
const unsetConnectionProfile = () => ({ type: Type.UNSET_CONNECTION_PROFILE })

const getUserProfilePhotosAttempt = member_id => ({ type: Type.GET_USER_PROFILE_PHOTOS_ATTEMPT, member_id })
const getUserProfilePhotosSuccess = photos => ({ type: Type.GET_USER_PROFILE_PHOTOS_SUCCESS, photos })
const getUserProfilePhotosFailure = errorCode => ({ type: Type.GET_USER_PROFILE_PHOTOS_FAILURE, errorCode })
const searchUserProfilePhotosAttempt = query => ({ type: Type.SEARCH_USER_PROFILE_PHOTOS_ATTEMPT, query })
const searchUserProfilePhotosSuccess = results => ({ type: Type.SEARCH_USER_PROFILE_PHOTOS_SUCCESS, results })
const clearUserProfilePhotosSearch = () => ({ type: Type.CLEAR_USER_PROFILE_PHOTOS_SEARCH })

const getConnectionProfilePhotosAttempt = member_id => ({ type: Type.GET_CONNECTION_PROFILE_PHOTOS_ATTEMPT, member_id })
const getConnectionProfilePhotosSuccess = photos => ({ type: Type.GET_CONNECTION_PROFILE_PHOTOS_SUCCESS, photos })
const getConnectionProfilePhotosFailure = errorCode => ({ type: Type.GET_CONNECTION_PROFILE_PHOTOS_FAILURE, errorCode })
const searchConnectionProfilePhotosAttempt = query => ({ type: Type.SEARCH_CONNECTION_PROFILE_PHOTOS_ATTEMPT, query })
const searchConnectionProfilePhotosSuccess = results => ({ type: Type.SEARCH_CONNECTION_PROFILE_PHOTOS_SUCCESS, results })
const clearConnectionProfilePhotosSearch = () => ({ type: Type.CLEAR_CONNECTION_PROFILE_PHOTOS_SEARCH })

const getUserProfileVideosAttempt = member_id => ({ type: Type.GET_USER_PROFILE_VIDEOS_ATTEMPT, member_id })
const getUserProfileVideosSuccess = videos => ({ type: Type.GET_USER_PROFILE_VIDEOS_SUCCESS, videos })
const getUserProfileVideosFailure = errorCode => ({ type: Type.GET_USER_PROFILE_VIDEOS_FAILURE, errorCode })
const searchUserProfileVideosAttempt = query => ({ type: Type.SEARCH_USER_PROFILE_VIDEOS_ATTEMPT, query })
const searchUserProfileVideosSuccess = results => ({ type: Type.SEARCH_USER_PROFILE_VIDEOS_SUCCESS, results })
const clearUserProfileVideosSearch = () => ({ type: Type.CLEAR_USER_PROFILE_VIDEOS_SEARCH })

const getConnectionProfileVideosAttempt = member_id => ({ type: Type.GET_CONNECTION_PROFILE_VIDEOS_ATTEMPT, member_id })
const getConnectionProfileVideosSuccess = videos => ({ type: Type.GET_CONNECTION_PROFILE_VIDEOS_SUCCESS, videos })
const getConnectionProfileVideosFailure = errorCode => ({ type: Type.GET_CONNECTION_PROFILE_VIDEOS_FAILURE, errorCode })
const searchConnectionProfileVideosAttempt = query => ({ type: Type.SEARCH_CONNECTION_PROFILE_VIDEOS_ATTEMPT, query })
const searchConnectionProfileVideosSuccess = results => ({ type: Type.SEARCH_CONNECTION_PROFILE_VIDEOS_SUCCESS, results })
const clearConnectionProfileVideosSearch = () => ({ type: Type.CLEAR_CONNECTION_PROFILE_VIDEOS_SEARCH })

const loadUserProfilePhotoAttempt = mediaId => ({ type: Type.LOAD_USER_PROFILE_PHOTO_ATTEMPT, mediaId })
const loadUserProfilePhotoSuccess = photo => ({ type: Type.LOAD_USER_PROFILE_PHOTO_SUCCESS, photo })
const unsetUserProfilePhoto = () => ({ type: Type.UNSET_USER_PROFILE_PHOTO })
const submitProfilePhotoAttempt = (media_id, photo) => ({ type: Type.SUBMIT_PROFILE_PHOTO_ATTEMPT, media_id, photo })
const addProfilePhotoSuccess = (photo, message) => ({ type: Type.ADD_PROFILE_PHOTO_SUCCESS, photo, message })
const updateProfilePhotoSuccess = (photo, message) => ({ type: Type.UPDATE_PROFILE_PHOTO_SUCCESS, photo, message })
const submitProfilePhotoFailure = errorCode => ({ type: Type.SUBMIT_PROFILE_PHOTO_FAILURE, errorCode })
const deleteProfilePhotoAttempt = media_id => ({ type: Type.DELETE_PROFILE_PHOTO_ATTEMPT, media_id })
const deleteProfilePhotoSuccess = (media_id, message) => ({ type: Type.DELETE_PROFILE_PHOTO_SUCCESS, media_id, message })
const deleteProfilePhotoFailure = errorCode => ({ type: Type.DELETE_PROFILE_PHOTO_FAILURE, errorCode })

const loadConnectionProfilePhotoAttempt = mediaId => ({ type: Type.LOAD_CONNECTION_PROFILE_PHOTO_ATTEMPT, mediaId })
const loadConnectionProfilePhotoSuccess = photo => ({ type: Type.LOAD_CONNECTION_PROFILE_PHOTO_SUCCESS, photo })
const unsetConnectionProfilePhoto = () => ({ type: Type.UNSET_CONNECTION_PROFILE_PHOTO })

const loadUserProfileVideoAttempt = mediaId => ({ type: Type.LOAD_USER_PROFILE_VIDEO_ATTEMPT, mediaId })
const loadUserProfileVideoSuccess = video => ({ type: Type.LOAD_USER_PROFILE_VIDEO_SUCCESS, video })
const unsetUserProfileVideo = () => ({ type: Type.UNSET_USER_PROFILE_VIDEO })

const submitProfileVideoAttempt = (media_id, video) => ({ type: Type.SUBMIT_PROFILE_VIDEO_ATTEMPT, media_id, video })
const addProfileVideoSuccess = (video, message) => ({ type: Type.ADD_PROFILE_VIDEO_SUCCESS, video, message })
const updateProfileVideoSuccess = (video, message) => ({ type: Type.UPDATE_PROFILE_VIDEO_SUCCESS, video, message })
const submitProfileVideoFailure = errorCode => ({ type: Type.SUBMIT_PROFILE_VIDEO_FAILURE, errorCode })
const deleteProfileVideoAttempt = media_id => ({ type: Type.DELETE_PROFILE_VIDEO_ATTEMPT, media_id })
const deleteProfileVideoSuccess = (media_id, message) => ({ type: Type.DELETE_PROFILE_VIDEO_SUCCESS, media_id, message })
const deleteProfileVideoFailure = errorCode => ({ type: Type.DELETE_PROFILE_VIDEO_FAILURE, errorCode })

const loadConnectionProfileVideoAttempt = mediaId => ({ type: Type.LOAD_CONNECTION_PROFILE_VIDEO_ATTEMPT, mediaId })
const loadConnectionProfileVideoSuccess = video => ({ type: Type.LOAD_CONNECTION_PROFILE_VIDEO_SUCCESS, video })
const unsetConnectionProfileVideo = () => ({ type: Type.UNSET_CONNECTION_PROFILE_VIDEO })

const viewConnectionProfileMediaAttempt = (mediaId, mediaType) => ({ type: Type.VIEW_CONNECTION_PROFILE_MEDIA_ATTEMPT, mediaId, mediaType })
const viewConnectionProfilePhotoSuccess = mediaId => ({ type: Type.VIEW_CONNECTION_PROFILE_PHOTO_SUCCESS, mediaId })
const viewConnectionProfileVideoSuccess = mediaId => ({ type: Type.VIEW_CONNECTION_PROFILE_VIDEO_SUCCESS, mediaId })

const getUserProfileBioAttempt = member_id => ({ type: Type.GET_USER_PROFILE_BIO_ATTEMPT, member_id })
const getUserProfileBioSuccess = bio => ({ type: Type.GET_USER_PROFILE_BIO_SUCCESS, bio })
const getUserProfileBioFailure = errorCode => ({ type: Type.GET_USER_PROFILE_BIO_FAILURE, errorCode })
const getConnectionProfileBioAttempt = member_id => ({ type: Type.GET_CONNECTION_PROFILE_BIO_ATTEMPT, member_id })
const getConnectionProfileBioSuccess = bio => ({ type: Type.GET_CONNECTION_PROFILE_BIO_SUCCESS, bio })
const getConnectionProfileBioFailure = errorCode => ({ type: Type.GET_CONNECTION_PROFILE_BIO_FAILURE, errorCode })

const addProfileBioAttempt = (member_id, bio) => ({ type: Type.ADD_PROFILE_BIO_ATTEMPT, member_id, bio })
const addProfileBioSuccess = (bio, message) => ({ type: Type.ADD_PROFILE_BIO_SUCCESS, bio, message })
const addProfileBioFailure = errorCode => ({ type: Type.ADD_PROFILE_BIO_FAILURE, errorCode })

const updateProfileBioAttempt = (member_id, bio) => ({ type: Type.UPDATE_PROFILE_BIO_ATTEMPT, member_id, bio })
const updateProfileBioSuccess = (bio, message) => ({ type: Type.UPDATE_PROFILE_BIO_SUCCESS, bio, message })
const updateProfileBioFailure = errorCode => ({ type: Type.UPDATE_PROFILE_BIO_FAILURE, errorCode })

const deleteProfileBioAttempt = (member_id, bio) => ({ type: Type.DELETE_PROFILE_BIO_ATTEMPT, member_id, bio })
const deleteProfileBioSuccess = (bio, message) => ({ type: Type.DELETE_PROFILE_BIO_SUCCESS, bio, message })
const deleteProfileBioFailure = errorCode => ({ type: Type.DELETE_PROFILE_BIO_FAILURE, errorCode })

const getUserProfileReferencesAttempt = member_id => ({ type: Type.GET_USER_PROFILE_REFERENCES_ATTEMPT, member_id })
const getUserProfileReferencesSuccess = (member_id, references) => ({ type: Type.GET_USER_PROFILE_REFERENCES_SUCCESS, member_id, references })
const getUserProfileReferencesFailure = errorCode => ({ type: Type.GET_USER_PROFILE_REFERENCES_FAILURE, errorCode })
const getConnectionProfileReferencesAttempt = member_id => ({ type: Type.GET_CONNECTION_PROFILE_REFERENCES_ATTEMPT, member_id })
const getConnectionProfileReferencesSuccess = (member_id, references) => ({ type: Type.GET_CONNECTION_PROFILE_REFERENCES_SUCCESS, member_id, references })
const getConnectionProfileReferencesFailure = errorCode => ({ type: Type.GET_CONNECTION_PROFILE_REFERENCES_FAILURE, errorCode })

const addProfileReferenceAttempt = (receiver_id, reference) => ({ type: Type.ADD_PROFILE_REFERENCE_ATTEMPT, receiver_id, reference })
const addProfileReferenceSuccess = message => ({ type: Type.ADD_PROFILE_REFERENCE_SUCCESS, message })
const addProfileReferenceFailure = (errorCode, errors) => ({ type: Type.ADD_PROFILE_REFERENCE_FAILURE, errorCode, errors })

const updateProfileReferenceAttempt = (member_id, reference_id, status) => ({ type: Type.UPDATE_PROFILE_REFERENCE_ATTEMPT, member_id, reference_id, status })
const updateProfileReferenceSuccess = (reference_id, status) => ({ type: Type.UPDATE_PROFILE_REFERENCE_SUCCESS, reference_id, status })
const updateProfileReferenceFailure = (reference_id, errorCode) => ({ type: Type.UPDATE_PROFILE_REFERENCE_FAILURE, reference_id, errorCode })


// Makes available all the action creators we've created.
export default {
	// Profile
	toggleUserProfileShowreel,
	toggleConnectionProfileShowreel,
	getConnectionProfileAttempt,
	getConnectionProfileSuccess,
	getConnectionProfileFailure,
	unsetConnectionProfile,
	// Photos
	getUserProfilePhotosAttempt,
	getUserProfilePhotosSuccess,
	getUserProfilePhotosFailure,
	searchUserProfilePhotosAttempt,
	searchUserProfilePhotosSuccess,
	clearUserProfilePhotosSearch,
	getConnectionProfilePhotosAttempt,
	getConnectionProfilePhotosSuccess,
	getConnectionProfilePhotosFailure,
	searchConnectionProfilePhotosAttempt,
	searchConnectionProfilePhotosSuccess,
	clearConnectionProfilePhotosSearch,
	// Videos
	getUserProfileVideosAttempt,
	getUserProfileVideosSuccess,
	getUserProfileVideosFailure,
	searchUserProfileVideosAttempt,
	searchUserProfileVideosSuccess,
	clearUserProfileVideosSearch,
	getConnectionProfileVideosAttempt,
	getConnectionProfileVideosSuccess,
	getConnectionProfileVideosFailure,
	searchConnectionProfileVideosAttempt,
	searchConnectionProfileVideosSuccess,
	clearConnectionProfileVideosSearch,
	// Photo & Video
	loadUserProfilePhotoAttempt,
	loadUserProfilePhotoSuccess,
	unsetUserProfilePhoto,
	loadConnectionProfilePhotoAttempt,
	loadConnectionProfilePhotoSuccess,
	unsetConnectionProfilePhoto,
	submitProfilePhotoAttempt,
	addProfilePhotoSuccess,
	updateProfilePhotoSuccess,
	submitProfilePhotoFailure,
	deleteProfilePhotoAttempt,
	deleteProfilePhotoSuccess,
	deleteProfilePhotoFailure,
	loadUserProfileVideoAttempt,
	loadUserProfileVideoSuccess,
	unsetUserProfileVideo,
	submitProfileVideoAttempt,
	addProfileVideoSuccess,
	updateProfileVideoSuccess,
	submitProfileVideoFailure,
	deleteProfileVideoAttempt,
	deleteProfileVideoSuccess,
	deleteProfileVideoFailure,
	loadConnectionProfileVideoAttempt,
	loadConnectionProfileVideoSuccess,
	unsetConnectionProfileVideo,
	viewConnectionProfileMediaAttempt,
	viewConnectionProfilePhotoSuccess,
	viewConnectionProfileVideoSuccess,
	// Experience & Education (Bio)
	getUserProfileBioAttempt,
	getUserProfileBioSuccess,
	getUserProfileBioFailure,
	getConnectionProfileBioAttempt,
	getConnectionProfileBioSuccess,
	getConnectionProfileBioFailure,
	addProfileBioAttempt,
	addProfileBioSuccess,
	addProfileBioFailure,
	updateProfileBioAttempt,
	updateProfileBioSuccess,
	updateProfileBioFailure,
	deleteProfileBioAttempt,
	deleteProfileBioSuccess,
	deleteProfileBioFailure,
	// References
	getUserProfileReferencesAttempt,
	getUserProfileReferencesSuccess,
	getUserProfileReferencesFailure,
	getConnectionProfileReferencesAttempt,
	getConnectionProfileReferencesSuccess,
	getConnectionProfileReferencesFailure,
	addProfileReferenceAttempt,
	addProfileReferenceSuccess,
	addProfileReferenceFailure,
	updateProfileReferenceAttempt,
	updateProfileReferenceSuccess,
	updateProfileReferenceFailure,
}
