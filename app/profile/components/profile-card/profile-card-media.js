import React, { Component } from 'react'
import {
	View,
} from 'react-native'

import PropTypes from 'prop-types'

import R from 'ramda'

import ss from '../../../styles'
import common from '../../../common'

import ProfileCardHeader from './profile-card-header'
import ProfileCardFooter from './profile-card-footer'

const { Loading, NoResults, Button, SegmentedControl } = common.components.core
const { PhotosCardView } = common.components.photo
const { VideosListView } = common.components.video


class ProfileCardMedia extends Component {

	state = {
		activeMediaTabIndex: 0,
	}

	shouldComponentUpdate(nextProps, nextState) {
		const {
			photos,
			gettingPhotos,
			canAddPhoto,
			videos,
			gettingVideos,
			canAddVideo,
		} = this.props

		// photos
		if (!R.equals(photos, nextProps.photos)) {
			return true
		}

		if (gettingPhotos !== nextProps.gettingPhotos) {
			return true
		}

		if (canAddPhoto !== nextProps.canAddPhoto) {
			return true
		}

		// videos
		if (!R.equals(videos, nextProps.videos)) {
			return true
		}

		if (gettingVideos !== nextProps.gettingVideos) {
			return true
		}

		if (canAddVideo !== nextProps.canAddVideo) {
			return true
		}

		if (this.state.activeMediaTabIndex !== nextState.activeMediaTabIndex) {
			return true
		}

		return false
	}

	onSegmentChange = (index) => {
		this.setState({ activeMediaTabIndex: index })
	}

	renderPhotos() {
		const {
			photos,
			gettingPhotos,
			canAddPhoto,
			onAddPhoto,
			onPhotoPress,
			onShowAllPhotos,
		} = this.props

		if (photos && photos.length) {
			return (
				<View style={{ flex: 1 }}>
					<PhotosCardView photos={photos} onPress={onPhotoPress} />
					<ProfileCardFooter onPress={onShowAllPhotos} />
				</View>
			)
		} else if (gettingPhotos) {
			// show loading while getting photos
			return <Loading style={styles.loading} />
		}

		return (
			<View style={styles.noResults}>
				<NoResults message="No photos yet" />
				{canAddPhoto && onAddPhoto &&
					<Button
						label="Upload"
						disabled={false}
						isLoading={false}
						onPress={onAddPhoto}
					/>
				}
			</View>
		)
	}

	renderVideos() {
		const {
			videos,
			gettingVideos,
			canAddVideo,
			onAddVideo,
			onVideoPress,
			onShowAllVideos,
		} = this.props

		if (videos && videos.length) {
			return (
				<View style={{ flex: 1 }}>
					<VideosListView videos={videos} onPress={onVideoPress} />
					<ProfileCardFooter onPress={onShowAllVideos} />
				</View>
			)
		} else if (gettingVideos) {
			// show loading while getting videos
			return <Loading style={styles.loading} />
		}

		return (
			<View style={styles.noResults}>
				<NoResults message="No videos yet" />
				{canAddVideo && onAddVideo &&
					<Button
						label="Upload"
						disabled={false}
						isLoading={false}
						onPress={onAddVideo}
					/>
				}
			</View>
		)
	}

	render() {
		const {
			photos,
			videos,
			canAddPhoto,
			onAddPhoto,
			canAddVideo,
			onAddVideo,
		} = this.props
		const { activeMediaTabIndex } = this.state

		let contents = null
		let onAddPress = null
		if (activeMediaTabIndex === 0) {
			if (canAddPhoto && onAddPhoto) {
				onAddPress = onAddPhoto
			}
		} else {
			if (canAddVideo && onAddVideo) {
				onAddPress = onAddVideo
			}
		}

		if ((photos && photos.length) || (videos && videos.length)) {
			// has photos or videos
			contents = (
				<View style={{ flex: 1 }}>
					<SegmentedControl
						style={{ marginTop: size(12) }}
						segments={[
							`Photos (${photos ? photos.length : 0})`,
							`Videos (${videos ? videos.length : 0})`,
						]}
						selectedIndex={activeMediaTabIndex}
						onPress={this.onSegmentChange}
					/>
					{activeMediaTabIndex === 0 ? this.renderPhotos() : this.renderVideos()}
				</View>
			)
		} else {
			// no photos and no videos
			contents = (
				<View style={styles.noResults}>
					<NoResults
						name="media"
						size={ss.size(60)}
						iconStyle={{ marginBottom: ss.size(15), marginLeft: ss.size(18) }}
						message="No media yet"
					/>
					{onAddPress &&
						<Button
							label="Upload"
							disabled={false}
							isLoading={false}
							onPress={onAddPress}
						/>
					}
				</View>
			)
		}

		return (
			<View style={{ flex: 1 }}>
				<ProfileCardHeader
					title="Media"
					onPress={onAddPress}
				/>
				<View style={{ flex: 1 }}>
					{contents}
				</View>
			</View>
		)
	}
}

ProfileCardMedia.propTypes = {
	photos: PropTypes.arrayOf(PropTypes.object),
	gettingPhotos: PropTypes.bool.isRequired,
	videos: PropTypes.arrayOf(PropTypes.object),
	gettingVideos: PropTypes.bool.isRequired,
	canAddPhoto: PropTypes.bool,
	onAddPhoto: PropTypes.func,
	onShowAllPhotos: PropTypes.func,
	onPhotoPress: PropTypes.func.isRequired,
	canAddVideo: PropTypes.bool,
	onAddVideo: PropTypes.func,
	onShowAllVideos: PropTypes.func,
	onVideoPress: PropTypes.func.isRequired,
}

ProfileCardMedia.defaultProps = {
	photos: null,
	videos: null,
	canAddPhoto: false,
	onAddPhoto: null,
	onShowAllPhotos: null,
	canAddVideo: false,
	onAddVideo: null,
	onShowAllVideos: null,
}

// StyleSheet
const {
	size,
} = ss

const styles = ss.create({
	noResults: {
		flex: 1,
		padding: size(20),
	},
})

export default ProfileCardMedia
