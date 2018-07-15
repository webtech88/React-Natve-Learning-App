import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
	View,
	Text,
	Animated,
} from 'react-native'

import ss from '../../../../styles'
import common from '../../../../common'

import { getVideoData } from '../../../util/helpers'

const { EmbedPlayer } = common.components.workbook
const { TransText } = common.components.core

class VideoBlock extends Component {

	constructor(props) {
		super(props)

		this.state = {
			top: 0,
			width: 0,
			animated: false,
			video: null,
		}
	}

	componentWillMount() {
		if (this.props.data && this.props.data.video) {
			getVideoData(this.props.data.video)
				.then(response => this.setState({ video: response }))
				.catch(() => this.onVideoError())
		}
	}

	onVideoError = () => {
		this.setState({ video: { id: null, service: null, url: null } })
	}

	render() {
		const { color, title, description } = this.props.data
		const { video } = this.state

		let fontColor = '#4a4a4a'
		if (color) {
			if (color === '#d4eae4' || color === '#ffffff' || color === '#d2db0f') {
				fontColor = '#4a4a4a'
			} else {
				fontColor = '#f9f9f9'
			}
		}

		return (
			<View
				style={[styles.block, { backgroundColor: color || '#F9F9F9' }]}
				onLayout={(e) => {
					this.setState({
						top: e.nativeEvent.layout.y,
						width: e.nativeEvent.layout.width,
					})
				}}
			>
				{video &&
					<Animated.View style={[
						styles.video,
						// { opacity: videoOpacity, transform: [{ translateX: videoOffset }] }
					]}
					>
						<View style={styles.video}>
							{/* TODO Giles please add video here (inline, no full screen), height size(180), width: use onLayout (check activity block)
							NOTE: Why is width necessary? Height at size(180) creates very wide video—should there be space left and right set by width?
								*/}
							{video.id && video.service && video.url
							? (<EmbedPlayer video={video} onError={this.onVideoError} />)
							: (
								<View style={{
									flex: 1,
									justifyContent: 'center',
									alignItems: 'center',
								}}
								>
									<TransText style={{ color: 'white' }} transkey="PROBLEM_LOADING_VIDEO" />
								</View>
							)}
						</View>
					</Animated.View>
				}
				{(title || description)
					? <Animated.View style={styles.textContainer}>
						{/* <Animated.View style={{ opacity: textOpacity, transform: [{ translateX: textOffset }] }}> */}
						{title
							? <Text selectable style={[styles.title, { color: fontColor }]}>{title}</Text>
							: null
						}
						{description
							? <Text selectable style={[styles.description, { color: fontColor }]}>
								{description}
							</Text>
							: null
						}
					</Animated.View>
					: null
				}
			</View>
		)
	}

}

VideoBlock.propTypes = {
	data: PropTypes.shape({
		color: PropTypes.string,
		title: PropTypes.string,
		description: PropTypes.string,
		video: PropTypes.string,
	}).isRequired,
}

// StyleSheet
const {
	size,
	typo: { h1, p },
} = ss

const styles = ss.create({
	block: {
		// paddingVertical: size(20),
		// paddingHorizontal: size(20),
	},
	video: {
		height: size(180),
		backgroundColor: 'black',
	},
	textContainer: {
		paddingVertical: size(20),
		paddingHorizontal: size(20),
	},
	title: {
		...h1,
		fontSize: size(26),
		lineHeight: size(34),
		// marginTop: size(20),
	},
	description: {
		...p,
		fontSize: size(16),
		lineHeight: size(22),
		marginTop: size(20),
		marginBottom: size(10),
	},
})

export default VideoBlock
