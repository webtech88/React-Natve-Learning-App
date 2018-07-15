import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
	View,
	Animated,
	Platform,
} from 'react-native'

import Video from 'react-native-video'
import common from '../../common'
import ss from '../../styles'

const { Loading } = common.components.core


class QualificationVideo extends Component {

	state = {
		paused: true,
		animOpacity: new Animated.Value(0),
		animTransform: new Animated.Value(1.25),
	}

	componentDidMount() {
		this.animateIn()
	}

	componentWillReceiveProps(newProps) {
		if (!this.state.paused && !newProps.play) {
			this.setState({ paused: true })
		} else if (this.state.paused && newProps.play) {
			this.setState({ paused: false })
		}
	}

	animateIn = () => {
		const spring = Animated.spring

		Animated.sequence([
			Animated.delay(100),
			Animated.parallel([
				spring(this.state.animOpacity, {
					toValue: 1,
					friction: 8,
					useNativeDriver: true,
				}),
				spring(this.state.animTransform, {
					toValue: 1,
					friction: 10,
					useNativeDriver: true,
				}),
			]),
		]).start(this.setState({ paused: !this.props.play }))
	}

	render() {
		const { source } = this.props
		const { paused } = this.state
		if (!source) return null

		const play = Platform.os === 'ios' ? paused : this.props.play

		return (
			<Animated.View
				style={[styles.view,
					{ opacity: this.state.animOpacity, transform: [{ scale: this.state.animTransform }] },
				]}
			>
				<View style={{ flex: 1 }}>
					<Loading style={styles.loading} color="white" message="Loading video..." />
					<Video
						ref={(c) => { this.videoPlayer = c }}
						style={styles.video}
						source={{ uri: source }}
						rate={play ? 1 : 0}
						paused={!play}
						volume={1}
						muted={false}
						resizeMode="cover"
						repeat
						playInBackground={false}
						playWhenInactive={false}
					/>
				</View>
			</Animated.View>
		)
	}
}

QualificationVideo.propTypes = {
	source: PropTypes.string.isRequired,
	play: PropTypes.bool,
}

QualificationVideo.defaultProps = {
	play: false,
}


// StyleSheet
const styles = ss.create({
	view: {
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		// backgroundColor: '#F9F9F9',
	},
	video: {
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		ios: {
			backgroundColor: 'transparent',
		},
	},
	loading: {
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: ss.size(75),
		left: 0,
		opacity: 0.7,
	},
})

export default QualificationVideo
