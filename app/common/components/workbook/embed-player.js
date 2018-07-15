import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { WebView, View, Platform } from 'react-native'

import YouTube from 'react-native-youtube'

import ss from '../../../styles'

import EmbedCloudinaryPlayer from './embed-cloudinary-player'
import { getVimeoIframe } from '../../util/helpers'
import TransText from '../core/transtext'

class EmbedPlayer extends Component {
	state = {
		vimeoVideo: null,
		cloudinaryVideoSource: null,
		cloudinaryPoster: null,
	}

	componentWillMount() {
		const { video: { service, url }, onError } = this.props

		if (service === 'vimeo') {
			getVimeoIframe(url, size(180), Math.floor(ss.constants.WIDTH_DEVICE))
				.then(video => this.setState({ vimeoVideo: video }))
				.catch(() => onError())
		}
	}

	render() {
		const { video, onError } = this.props
		const { vimeoVideo } = this.state

		if (video) {
			switch (video.service) {
			case 'youtube':
				return (
					<YouTube
						videoId={video.id}
						style={styles.youtube}
						onError={onError}
					/>
				)
			case 'vimeo':
				if (Platform.OS === 'android') {
					return (
						<View style={[
							styles.youtube,
							{
								justifyContent: 'center',
								alignItems: 'center',
							},
						]}
						>
							<TransText style={{ color: 'white' }} transkey="VIDEO_NOT_SUPPORTED_VIMEO" />
						</View>
					)
				}
				if (vimeoVideo) {
					return (<WebView
						style={styles.vimeo}
						source={{ html: vimeoVideo.html, baseUrl: vimeoVideo.html.split('"')[1] }}
						scrollEnabled={false}
						onError={onError}
						allowsInlineMediaPlayback
					/>)
				}
				break
			case 'cloudinary':
				return (
					<EmbedCloudinaryPlayer video={video} />
				)
			default:
				return null
			}
		}

		return null
	}
}

EmbedPlayer.propTypes = {
	video: PropTypes.shape({
		id: PropTypes.string,
		service: PropTypes.string,
		url: PropTypes.string,
	}).isRequired,
	onError: PropTypes.func,
}

EmbedPlayer.defaultProps = {
	onError: () => {},
}

// StyleSheet
const {
	size,
} = ss

const styles = ss.create({
	youtube: {
		height: size(180),
		backgroundColor: 'black',
	},
	vimeo: {
		backgroundColor: 'black',
		height: size(180),
		width: Math.floor(ss.constants.WIDTH_DEVICE),
		marginTop: -8,
		marginLeft: -size(9),
	},
})

export default EmbedPlayer
