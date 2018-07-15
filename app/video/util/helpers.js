export const findVideo = (categories, mediaId) => {
	let categoryIndex = null
	let videoIndex = null

	categoryIndex = categories.findIndex(category => category.videos.findIndex((video, vidIndex) => {
		if (video.media_id === mediaId) {
			videoIndex = vidIndex

			return true
		}
		return false
	}) > -1)

	if (categoryIndex > -1 && videoIndex > -1) {
		return { categoryIndex, videoIndex }
	}
	return { categoryIndex: -1, videoIndex: -1 }
}
