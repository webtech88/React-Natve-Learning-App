import React, { Component } from 'react'
import {
	View,
	Animated,
	TouchableHighlight,
	Image,
	Platform,
} from 'react-native'

import { Actions as NavigationActions } from 'react-native-router-flux'
import { connect } from 'react-redux'

import VideoActions from '../actions/creator'
import ss from '../../styles'
import common from '../../common'

const { Loading, NoResults } = common.components.core
const { VideoEnhancer } = common.components.video


class VideoScreen extends Component {

	// state = {
	// 	navButton: true,
	// 	animNavButtonOpacity: new Animated.Value(1),
	// }

	componentDidMount() {
		const { userId, mediaId, videoCategoryId, onLoadVideo } = this.props
		onLoadVideo(userId, mediaId, videoCategoryId)
	}

	componentWillReceiveProps(nextProps) {
		const { userId, mediaId, onLoadVideo } = this.props
		if (mediaId !== nextProps.mediaId) {
			onLoadVideo(userId, nextProps.mediaId, nextProps.videoCategoryId)
		}
	}

	componentWillUnmount() {
		this.props.onUnsetVideo()
	}

	// toggleNavButton = (isPlaying, navButton) => {
	// 	this.setState({ navButton })
	//
	// 	Animated.timing(
	// 		this.state.animNavButtonOpacity,
	// 		{
	// 			toValue: navButton ? 1 : 0,
	// 			duration: (isPlaying && navButton) ? 0 : 200,
	// 		},
	// 	).start()
	// }

	handleLikePress = () => {
		const { video: { media_id, member_actions: { liked } }, onLikeVideo, onUnlikeVideo, userId } = this.props

		if (liked === 0) {
			onLikeVideo(userId, media_id)
		} else if (liked === 1) {
			onUnlikeVideo(userId, media_id)
		}
	}

	render() {
		const {
			userId,
			mediaId,
			loadingVideo,
			video,
			relatedVideos,
			onLikeVideo,
			onDownloadVideo,
			onShareVideo,
			// onReportVideo,
			// onDismissVideo,
			navigateToVideo,
		} = this.props
		let contents = null


		if (loadingVideo) {
			contents = <Loading message="Loading video" />
		} else if (video) {
			contents = (
				<VideoEnhancer
					video={video}
					// TODO
					// onVideoStateChange={state => console.log('video state', state)}
					onLike={this.handleLikePress}
					onDownload={() => onDownloadVideo(userId, mediaId)}
					onShare={() => onShareVideo(userId, mediaId)}
					// onReport={onReportVideo}
					// onDismiss={onDismissVideo}
					relatedVideos={relatedVideos}
					onRelatedVideoPress={navigateToVideo}
				/>
			)
		} else {
			contents = (
				<NoResults
					name="media"
					//iconWidth={106}
					//iconHeight={89}
					size={size(42)}
					message="Video not found"
				/>
			)
		}

		// TODO
		// onReport
		// dismiss button
		// onDismiss ??

		return (
			<View style={{ flex: 1 }}>
				{contents}
				{Platform.OS === 'ios' &&
					<Animated.View
						style={[
							styles.navButton,
							// { opacity: animNavButtonOpacity }
						]}
					>
						<View style={styles.navButtonIconCircle}>
							<TouchableHighlight
								style={styles.navButtonIconCircleTouch}
								// disabled={!navButton}
								activeOpacity={1}
								underlayColor="transparent"
								onPress={NavigationActions.pop}
							>
								<Image style={styles.navButtonIcon} name="hide" />
							</TouchableHighlight>
						</View>
					</Animated.View>
				}
			</View>
		)
	}

}

// StyleSheet
const {
	size,
	navBar: { navButtonIconCircle, navButtonIconCircleTouch, navButtonIcon },
} = ss

const styles = ss.create({
	navButton: {
		// backgroundColor: 'pink', // NOTE testing flexbox
		position: 'absolute',
		top: 0,
		left: 0,
		padding: size(10),
		zIndex: 1,
	},
	navButtonIconCircle: {
		...navButtonIconCircle,
		shadowOffset: {
			height: 1,
		},
		elevation: 1,
	},
	navButtonIconCircleTouch: {
		...navButtonIconCircleTouch,
	},
	navButtonIcon: {
		...navButtonIcon,
	},
})


// Redux mappings
const mapStateToProps = (state) => {
	const { data, loadingVideo, categoryIndex, videoIndex } = state.video
	const videos = data && data[categoryIndex] && data[categoryIndex].videos
	let relatedVideos

	if (videos) {
		relatedVideos = videos.filter((relatedVideo, index) => index !== videoIndex)
	}

	return {
		userId: state.user.data.member_id,
		loadingVideo,
		video: videos && videos[videoIndex],
		relatedVideos: relatedVideos || [],
	}
}

const mapDispatchToProps = dispatch => ({
	onLoadVideo: (userId, mediaId, videoCategoryId) => {
		dispatch(VideoActions.loadVideoAttempt(userId, mediaId, videoCategoryId))
	},
	onLikeVideo: (memberId, mediaId) => {
		dispatch(VideoActions.likeVideoAttempt(memberId, mediaId))
	},
	onUnlikeVideo: (memberId, mediaId) => {
		dispatch(VideoActions.unlikeVideoAttempt(memberId, mediaId))
	},
	onDownloadVideo: () => {
		console.log('TODO download video')
	},
	onShareVideo: () => {
		console.log('TODO share video')
	},
	// onReportVideo: () => null,
	// onDismissVideo: () => null,
	onUnsetVideo: () => {
		dispatch(VideoActions.unsetVideo())
	},
	navigateToVideo: ({ media_id, video_category_id }) => {
		NavigationActions.refresh({ mediaId: media_id, videoCategoryId: video_category_id })
	},
})

export default connect(mapStateToProps, mapDispatchToProps)(VideoScreen)
