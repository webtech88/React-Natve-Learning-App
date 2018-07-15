import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
	ScrollView,
	View,
	TouchableOpacity,
	Animated,
	Platform,
} from 'react-native'

// import { Actions as NavigationActions } from 'react-native-router-flux'

import cloudinary from 'cloudinary-core'
import Config from 'react-native-config'

import cloudinaryConfiguration from '../../../core/config/cloudinary'

import VideoPlayer from './video-player'
import ActionSheetButton from '../../../core/components/action-sheet-button'
import VideosListItem from './videos-list-item'
import MediaTag from '../profile/tag'
import TransText from '../core/transtext'
import Icon from '../core/icon'

import ss from '../../../styles'

const HEIGHT_VIDEO_PLAYER = ss.size(210)
const WIDTH = ss.constants.WIDTH_DEVICE


class VideoEnhancer extends Component {

	constructor(props) {
		super(props)

		this.cl = cloudinary.Cloudinary.new({ cloud_name: Config.CLOUDINARY_CLOUD_NAME })
	}

	state = {
		scrollOffsetY: new Animated.Value(0),
		infoHeight: 0,
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.video && this.props.video !== nextProps.video) {
			const prevVideoId = this.props.video && this.props.video.media_id
			const videoId = nextProps.video && nextProps.video.media_id

			if (prevVideoId !== videoId) {
				this.videoScroll.scrollTo({ x: 0, y: 0, animated: false })
			}
		}
	}

	getInfoHeight = (e) => {
		const height = e.nativeEvent.layout.height
		this.setState({ infoHeight: height })
	}

	abbreviateCount = count =>
		// abbreviate if in the thousands or millions
			(count < 1000)
				? count
				: (count < 1000000
					? `${(count / 1000).toFixed(1)} K`
					: `${(count / 1000000).toFixed(1)} M`)

	renderTags = tags => (
		<View style={styles.tagContainer}>
			{tags.map((tag, index) => (
				<MediaTag
					key={`${tag}_${index}`}
					tag={tag}
				/>
			))}
		</View>
	)

	renderVideoStats = () => {
		const { onLike, onDownload, onShare } = this.props
		const { viewed, liked, downloaded, shared, member_actions } = this.props.video

		return (
			<View>
				<View style={styles.stats}>
					<View style={[styles.statsItem, { opacity: 0.5 }]}>
						<Icon name="eye-open" size={ss.size(12)} />
						<TransText style={styles.statsCount} transkey={this.abbreviateCount(viewed)} />
					</View>
					<TouchableOpacity
						style={styles.statsItem}
						activeOpacity={0.7}
						onPress={onLike}
					>
						<Icon
							name={member_actions && member_actions.liked > 0
								? 'heart'
								: 'heart-outline'
							}
							size={ss.size(26)}
						/>
						<TransText style={styles.statsCount} transkey={this.abbreviateCount(liked)} />
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.statsItem}
						activeOpacity={0.7}
						onPress={onDownload}
					>
						<Icon name="download" size={ss.size(26)} />
						<TransText style={styles.statsCount} transkey={this.abbreviateCount(downloaded)} />
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.statsItem}
						activeOpacity={0.7}
						onPress={onShare}
					>
						<Icon name="share" size={ss.size(26)} />
						<TransText style={styles.statsCount} transkey={this.abbreviateCount(shared)} />
					</TouchableOpacity>
				</View>
				<View style={styles.divider} />
			</View>
		)
	}

	render() {
		const { video, onEdit, relatedVideos, onRelatedVideoPress } = this.props
		const { cloudinary_file_id, title, description, tags } = video

		const { infoHeight } = this.state
		const videoSource = this.cl.url(cloudinary_file_id, { ...cloudinaryConfiguration.video })
		const videoPoster = this.cl.url(`${cloudinary_file_id}.jpg`, { ...cloudinaryConfiguration.poster, height: HEIGHT_VIDEO_PLAYER * 2 })

		const scrollZindex = this.state.scrollOffsetY.interpolate({
			inputRange: [infoHeight + 1, infoHeight + 1],
			outputRange: [1, 0],
			extrapolate: 'clamp',
		})

		// Sets opacity of original info view to zero on scroll (infoHeight + 1 to clear top border)
		const statsOpacity = this.state.scrollOffsetY.interpolate({
			inputRange: [infoHeight + 1, infoHeight + 1],
			outputRange: [1, 0],
			extrapolate: 'clamp',
		})

		// Sets opacity of absolute-positioned info view to 1 on scroll
		const fixedStatsOpacity = this.state.scrollOffsetY.interpolate({
			inputRange: [infoHeight + 1, infoHeight + 1],
			outputRange: [0, 1],
			extrapolate: 'clamp',
		})

		return (
			<View style={styles.enhancer}>
				<View style={styles.videoPlayerUnderlay} />
				<VideoPlayer
					source={videoSource}
					poster={videoPoster}
					height={HEIGHT_VIDEO_PLAYER}
					fullScreenSupport={Platform.OS === 'ios'}
				/>
				<Animated.View style={[styles.statsCloned, { opacity: fixedStatsOpacity, zIndex: fixedStatsOpacity }]}>
					{this.renderVideoStats()}
				</Animated.View>
				<View style={{ flex: 1 }}>
					<Animated.View style={{ flex: 1, zIndex: scrollZindex }}>
						<ScrollView
							style={styles.scroll}
							ref={(c) => { this.videoScroll = c }}
							contentContainerStyle={styles.scrollContainer}
							showsVerticalScrollIndicator={false}
							directionalLockEnabled
							scrollEventThrottle={16}
							bounces
							onScroll={Animated.event(
								[{ nativeEvent: { contentOffset: { y: this.state.scrollOffsetY } } }],
							)}
						>
							{/* Video info */}
							<View onLayout={this.getInfoHeight} style={styles.info}>
								<View style={styles.header}>
									<View style={{ flex: 1 }}>
										<TransText style={styles.title} transkey={title} />
									</View>
									{onEdit &&
										<View style={styles.actions}>
											<ActionSheetButton onPress={onEdit} />
										</View>
									}
								</View>
								<TransText style={styles.desc} transkey={description} />
								{tags && tags.length > 0 && this.renderTags(tags)}
							</View>
							<View style={styles.divider} />
							{/* Video stats */}
							<Animated.View style={{ opacity: statsOpacity }}>
								{this.renderVideoStats()}
							</Animated.View>
							{/* Related Videos */}
							{relatedVideos && onRelatedVideoPress && (
								<View>
									<View style={styles.relatedHeader}>
										<TransText style={styles.relatedHeading} transkey="RELATED_VIDEOS" />
									</View>
									<View style={styles.divider} />
									{relatedVideos.map((video, index) => (
										<View style={{ flex: 1 }} key={`RelatedVideo_${video.media_id}`}>
											{(index > 0) && <View style={styles.divider} />}
											<VideosListItem video={video} onPress={() => onRelatedVideoPress(video)} />
										</View>
									))}
								</View>
							)}
						</ScrollView>
					</Animated.View>
				</View>
			</View>
		)
	}

}

VideoEnhancer.propTypes = {
	video: PropTypes.shape({
		media_id: PropTypes.number.isRequired,
		cloudinary_file_id: PropTypes.string.isRequired,
		title: PropTypes.string.isRequired,
		description: PropTypes.string.isRequired,
		viewed: PropTypes.number.isRequired,
		liked: PropTypes.number.isRequired,
		downloaded: PropTypes.number.isRequired,
		shared: PropTypes.number.isRequired,
	}).isRequired,
	onEdit: PropTypes.func,
	onLike: PropTypes.func,
	onDownload: PropTypes.func,
	onShare: PropTypes.func,
	relatedVideos: PropTypes.arrayOf(PropTypes.object),
	onRelatedVideoPress: PropTypes.func,
}

VideoEnhancer.defaultProps = {
	onEdit: null,
	onLike: null,
	onDownload: null,
	onShare: null,
	relatedVideos: [],
	onRelatedVideoPress: null,
}


// StyleSheet
const {
	size,
	typo: { p, pLight, pSemiBold },
} = ss

const styles = ss.create({
	enhancer: {
		flex: 1,
	},
	videoPlayerUnderlay: {
		height: HEIGHT_VIDEO_PLAYER,
		width: WIDTH,
		backgroundColor: 'black',
	},
	scroll: {
		// backgroundColor: 'pink', // NOTE testing flexbox
	},
	scrollContainer: {
		paddingBottom: size(10),
	},
	info: {
		// backgroundColor: 'pink', // NOTE testing flexbox
		padding: size(20),
		flex: 1,
	},
	header: {
		// backgroundColor: 'pink', // NOTE testing flexbox
		flexDirection: 'row',
		marginBottom: size(15),
	},
	title: {
		...pSemiBold,
		color: ss.constants.COLOR_HEADING,
	},
	actions: {
		// backgroundColor: 'pink', // NOTE testing flexbox
		top: -size(5),
		right: -size(10),
	},
	desc: {
		...p,
		fontSize: size(14),
		marginBottom: size(10),
	},
	divider: {
		height: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.1)',
	},

	// video stats
	stats: {
		backgroundColor: 'white',
		// backgroundColor: 'pink', // NOTE testing flexbox
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: size(25),
		paddingHorizontal: size(20),
	},
	statsCloned: {
		position: 'absolute',
		top: HEIGHT_VIDEO_PLAYER,
		left: 0,
		right: 0,
	},
	statsItem: {
		// backgroundColor: 'pink', // NOTE testing flexbox
		flexDirection: 'row',
		alignItems: 'center',
	},
	statsCount: {
		...p,
		fontSize: size(12),
		color: ss.constants.COLOR_HEADING,
		marginLeft: size(10),
	},

	// related videos
	relatedHeader: {
		backgroundColor: '#F9F9F9',
		paddingTop: size(25),
		paddingBottom: size(10),
		paddingHorizontal: size(20),
	},
	relatedHeading: {
		...pLight,
		fontSize: size(18),
	},
	tagContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		paddingVertical: size(10),
	},
})

export default VideoEnhancer
