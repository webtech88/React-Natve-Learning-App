import React from 'react'

import { Actions as NavigationActions } from 'react-native-router-flux'
import { connect } from 'react-redux'

import VideoActions from '../actions/creator'

import common from '../../common'

const { Search } = common.components.core
const { VideosListView } = common.components.video

const VideosSearchScreen = ({
	query,
	videos,
	onFilterVideos,
	navigateToVideo,
}) =>
	(<Search
		query={query}
		onSearch={query => onFilterVideos(query)}
	>
		{
			query
			&& videos
			&& videos.length
			&& <VideosListView videos={videos} onPress={navigateToVideo} />
		}
	</Search>)


// Redux mappings
const mapStateToProps = (state) => {
	const { video } = state

	return {
		query: video.filterQuery,
		videos: video.filterData,
	}
}

const mapDispatchToProps = dispatch => ({
	onFilterVideos: (query) => {
		dispatch(VideoActions.filterVideosAttempt(query))
	},
	navigateToVideo: ({ media_id, video_category_id }) => {
		NavigationActions.Video({ mediaId: media_id, videoCategoryId: video_category_id })
	},
})

export default connect(mapStateToProps, mapDispatchToProps)(VideosSearchScreen)
