import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Platform } from 'react-native'

import cloudinary from 'cloudinary-core'
import Config from 'react-native-config'

import cloudinaryConfiguration from '../../../core/config/cloudinary'

import ss from '../../../styles'
import VideoPlayer from '../video/video-player'

const HEIGHT_VIDEO_PLAYER = ss.size(180)

class EmbedCloudinaryPlayer extends Component {

	constructor(props) {
		super(props)

		this.cl = cloudinary.Cloudinary.new({ cloud_name: Config.CLOUDINARY_CLOUD_NAME })
	}

	render() {
		const { video: { id }, onError } = this.props
		const videoSource = this.cl.url(id, { ...cloudinaryConfiguration.video })
		const videoPoster = this.cl.url(`${id}.jpg`, {
			...cloudinaryConfiguration.poster,
			height: HEIGHT_VIDEO_PLAYER * 2,
		})


		if (id) {
			return (
				<VideoPlayer
					source={videoSource}
					poster={videoPoster}
					height={HEIGHT_VIDEO_PLAYER}
					// fullScreenSupport={Platform.OS === 'ios'}
					onError={onError}
				/>
			)
		}

		return null
	}
}

EmbedCloudinaryPlayer.propTypes = {
	video: PropTypes.shape({
		id: PropTypes.string,
		service: PropTypes.string,
		url: PropTypes.string,
	}).isRequired,
	onError: PropTypes.func,
}

EmbedCloudinaryPlayer.defaultProps = {
	onError: () => {},
}

export default EmbedCloudinaryPlayer
