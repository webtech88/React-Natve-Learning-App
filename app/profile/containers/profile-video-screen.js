import React, { Component } from 'react'
import {
	View,
	Platform,
} from 'react-native'

import PropTypes from 'prop-types'

import R from 'ramda'
import { Actions as NavigationActions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import ProfileActions from '../actions/creator'

import ss from '../../styles'
import common from '../../common'

const { Loading, NoResults } = common.components.core
const { VideoEnhancer } = common.components.video
const { BackButton } = common.components.navigation


class ProfileVideoScreen extends Component {

	componentWillMount() {
		this.props.loadProfileVideo(this.props.mediaId)
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.mediaId !== nextProps.mediaId) {
			this.props.loadProfileVideo(nextProps.mediaId)
		}
	}

	componentWillUnmount() {
		this.props.unsetProfileVideo()
	}

	render() {
		const {
			profileType,
			mediaId,
			loadingVideo,
			video,
			navigateToProfileVideoForm,
			likeProfileVideo,
			downloadProfileVideo,
			shareProfileVideo,
		} = this.props
		let videoProps
		let contents = null

		if (R.equals('user', profileType)) {
			videoProps = {
				onEdit: () => navigateToProfileVideoForm(),
			}
		} else {
			videoProps = {
				onLike: () => likeProfileVideo(mediaId),
				onDownload: () => downloadProfileVideo(mediaId),
				onShare: () => shareProfileVideo(mediaId),
			}
		}
		if (loadingVideo) {
			contents = <Loading message="Loading video..." />
		} else if (video) {
			contents = (
				<VideoEnhancer video={video} {...videoProps} />
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

		return (
			<View style={{ flex: 1 }}>
				{contents}
				{Platform.OS === 'ios' &&
				<BackButton name="hide" onPress={NavigationActions.pop} />
				}
			</View>
		)
	}

}

ProfileVideoScreen.propTypes = {
	profileType: PropTypes.oneOf(['user', 'friend']).isRequired,
	mediaId: PropTypes.number.isRequired,
	loadingVideo: PropTypes.bool.isRequired,
	video: PropTypes.object,
	loadProfileVideo: PropTypes.func.isRequired,
	likeProfileVideo: PropTypes.func.isRequired,
	downloadProfileVideo: PropTypes.func.isRequired,
	shareProfileVideo: PropTypes.func.isRequired,
	unsetProfileVideo: PropTypes.func.isRequired,
}

ProfileVideoScreen.defaultProps = {
	video: null,
}

// Redux mappings
const mapStateToProps = state => ({
	userId: state.user.data.member_id,
	loadingVideo: state.profile.loadingVideo,
	video: state.profile.video,
	loadingConnectionVideo: state.profile.connectionProfile.loadingVideo,
	connectionVideo: state.profile.connectionProfile.video,
})

function mergeProps(stateProps, dispatchProps, ownProps) {
	const { dispatch } = dispatchProps
	let userId
	let loadingVideo = stateProps.loadingConnectionVideo
	let video = stateProps.connectionVideo

	// NOTE is current user profile?
	if (R.equals('user', ownProps.profileType)) {
		userId = stateProps.userId
		loadingVideo = stateProps.loadingVideo
		video = stateProps.video
	}

	return {
		...ownProps,
		loadingVideo,
		video,
		loadProfileVideo: (mediaId) => {
			if (userId) {
				dispatch(ProfileActions.loadUserProfileVideoAttempt(mediaId))
			} else {
				dispatch(ProfileActions.loadConnectionProfileVideoAttempt(mediaId))
			}
		},
		likeProfileVideo: () => {
			console.log('TODO like video')
		},
		downloadProfileVideo: () => {
			console.log('TODO download video')
		},
		shareProfileVideo: () => {
			console.log('TODO share video')
		},
		// reportProfileVideo: () => null,
		unsetProfileVideo: () => {
			if (userId) {
				dispatch(ProfileActions.unsetUserProfileVideo())
			} else {
				dispatch(ProfileActions.unsetConnectionProfileVideo())
			}
		},
		navigateToProfileVideoForm: () => NavigationActions.ProfileVideoForm(),
	}
}

export default connect(mapStateToProps, null, mergeProps)(ProfileVideoScreen)
