import PropTypes from 'prop-types'
// TODO need to improve orientation state
// TODO this player needs a good cleanup & improvements
import React, { Component } from 'react'
import {
	View,
	// TouchableOpacity, // TODO BUG not fully touchable on iPhone 7 when parent view rotated
	TouchableHighlight,
	TouchableWithoutFeedback,
	Animated,
	Platform,
} from 'react-native'

import Video from 'react-native-video'

import ss from '../../../styles'

import { formatTime } from '../../util/helpers'
import Loading from '../core/loading'
import TransText from '../core/transtext'
import VideoPlayerSlider from './video-player-slider'
import Icon from '../core/icon'

const HEIGHT = ss.constants.HEIGHT_DEVICE
const WIDTH = ss.constants.WIDTH_DEVICE

let timeout


class VideoPlayer extends Component {

	state = {
			// video defaults
		rate: 1, // not used
		volume: 1, // not used
		muted: false, // not used
		paused: true, // used for play/pause
		controls: true,
		duration: 0.0,
		currentTime: 0.0,
			// video custom
		isLoading: false,
		isBuffering: false,
		isPlaying: false, // used for slider if should continue to play video
			// current time bar
		thumbSize: size(15),
		fullScreen: false,
			// orientation
		specificOrientation: 'PORTRAIT',
		previousOrientation: null,
		videoOrientation: 'PORTRAIT', // Screen opens with video NOT fullscreen
			// animations
		animControlsOpacity: new Animated.Value(1),
		animFullScreen: new Animated.Value(0), // NOTE -1 is LANDSCAPE-LEFT, 0 is PORTRAIT, 1 is LANDSCAPE-RIGHT
	}

	/* componentWillMount() {
		//  set specificOrientation to "PORTRAIT", "PORTRAITUPSIDEDOWN", "LANDSCAPE-LEFT", "LANDSCAPE-RIGHT"
		Orientation.getSpecificOrientation((err, orientation) => {
			// console.log(orientation);
			this.setState({ specificOrientation: orientation })
		})
	}

	componentDidMount() {
		// TODO: fullScreen or not fullScreen on load when in landscape?
		// Orientation.getSpecificOrientation((err, orientation)=> {
		// 	this.setState({specificOrientation: orientation})
		//
		//
		// 	// if (orientation==="LANDSCAPE-LEFT" || orientation==="LANDSCAPE-RIGHT") {
		// 	// 	this.onFullScreen()}
		// 	// }
		// });
		// console.log(this.videoPlayer);
		Orientation.addSpecificOrientationListener(this.orientationDidChange)
	}

	componentWillUnmount() {
		Orientation.removeSpecificOrientationListener(this.orientationDidChange)
	}*/


	// react-native-video functions
	onLoadStart = () => {
		// console.log('On load start fired!', data);
		this.setState({ isLoading: true })
	}

	onLoad = (data) => {
		// console.log('On load fired!', data);
		this.setState({ isLoading: false, duration: data.duration })
	}

	onProgress = (data) => {
		// console.log('On progress fired!', data);
		this.setState({ currentTime: data.currentTime })
	}

	onBuffer = ({ isBuffering }: { isBuffering: boolean }) => {
		// console.log('On buffer fired!', isBuffering);
		this.setState({ isBuffering })
	}

	onEnd = () => {
		// console.log('On end fired!', data);
		this.setState({ paused: true, isPlaying: false })
	}

	onError = (data) => {
		const { onError } = this.props
		if (onError) {
			onError(data)
		}
	}

	onFullScreen = (buttonPressed) => {
		// console.log('toggle full screen')
		// TODO this probably can be simplified
		const { fullScreenSupport } = this.props

		if (!fullScreenSupport) return

		const {
			fullScreen,
			specificOrientation,
			previousOrientation,
		} = this.state

		let animToValue

		// PORTRAIT
		if (specificOrientation === 'PORTRAIT') {
			if (specificOrientation === previousOrientation && buttonPressed) { // First case: in portrait, pressing button
				if (!fullScreen) {
					animToValue = -1 // set to full screen (set up for landscape left)
					this.setState({
						fullScreen: true, // has gone to full screen
						videoOrientation: 'LANDSCAPE-LEFT', // video is landscape left
					})
				} else {
					animToValue = 0 // exit full screen
					this.setState({
						fullScreen: false,
						videoOrientation: 'PORTRAIT',
					})
				}
			} else { // Second case: user rotates screen to portrait
				// if (specificOrientation !== previousOrientation)
				animToValue = 0 // exit full screen
				this.setState({
					fullScreen: false,
					previousOrientation: 'PORTRAIT',
					videoOrientation: 'PORTRAIT',
				})
			}
		} else if (specificOrientation === 'LANDSCAPE-LEFT') { // LANDSCAPE-LEFT
			if (specificOrientation === previousOrientation && buttonPressed) { // First case: in landscape-left, pressing button
				if (!fullScreen) {
					animToValue = -1
					this.setState({
						fullScreen: true, // has gone to full screen
						videoOrientation: 'LANDSCAPE-LEFT', // video is landscape left
					})
				} else {
					animToValue = 0 // exit full screen
					this.setState({
						fullScreen: false,
						videoOrientation: 'PORTRAIT',
					})
				}
			} else { // Second case: user rotates to LANDSCAPE-LEFT
				// if (specificOrientation !== previousOrientation)
				animToValue = -1
				this.setState({
					fullScreen: true,
					previousOrientation: 'LANDSCAPE-LEFT',
					videoOrientation: 'LANDSCAPE-LEFT',
				})
			}
		} else if (specificOrientation === 'LANDSCAPE-RIGHT') { // LANDSCAPE-RIGHT
			// First case: in landscape-right, pressing button
			if (specificOrientation === previousOrientation && buttonPressed) {
				if (!fullScreen) {
					animToValue = 1
					this.setState({
						fullScreen: true, // has gone to full screen
						videoOrientation: 'LANDSCAPE-RIGHT', // video is landscape right
					})
				} else {
					animToValue = 0 // exit full screen
					this.setState({
						fullScreen: false,
						videoOrientation: 'PORTRAIT',
					})
				}
			} else { // Second case: user rotates to LANDSCAPE-RIGHT
				// if (specificOrientation !== previousOrientation)
				animToValue = 1
				this.setState({
					fullScreen: true,
					previousOrientation: 'LANDSCAPE-RIGHT',
					videoOrientation: 'LANDSCAPE-RIGHT',
				})
			}
		} else if (specificOrientation === 'PORTRAITUPSIDEDOWN') { // WHEN UPSIDE DOWN
			// First case: in portrait upside down, pressing button
			if (specificOrientation === previousOrientation && buttonPressed) {
				if (!fullScreen) {
					animToValue = -1
					this.setState({
						fullScreen: true, // has gone to full screen
						videoOrientation: 'LANDSCAPE-LEFT', // video is landscape left
					})
				} else {
					animToValue = 0
					this.setState({
						fullScreen: false,
						videoOrientation: 'PORTRAIT', // NOTE: NOT "PORTRAIT UPSIDE DOWN"
					})
				}
			} else {
				this.setState({
					previousOrientation: 'PORTRAITUPSIDEDOWN',
				})
				return
			}
		}

		if (animToValue !== undefined) {
			Animated.timing(
				this.state.animFullScreen,
				{
					toValue: animToValue,
					duration: 500,
				},
			).start()
		}
	}

	onSlidingStart = () => {
		// console.log('on start slider');
		this.setState({
			thumbSize: size(20),
			paused: true,
		})
	}

	onSlidingComplete = () => {
		// console.log('on finished sliding', this.state.currentTime);
		this.setState({
			thumbSize: size(15),
			paused: !this.state.isPlaying,
		})

		this.videoPlayer.seek(this.state.currentTime)

		timeout = setTimeout(() => {
			if (!this.state.paused && this.state.controls) {
				// NOTE hide controls if visible and video is playing
				this.toggleControls()
			}
		}, 2500)
	}

	changeCurrentTime = (value) => {
		this.setState({ currentTime: value })
	}

	// handle player state
	togglePlay = () => {
		const { currentTime, duration } = this.state
		// console.log('toggle play', this.state.paused, currentTime, duration);

		clearTimeout(timeout)

		// TODO replay button
		if (Math.floor(currentTime) >= Math.floor(duration)) {
			this.videoPlayer.seek(0)
		}

		this.setState({ paused: !this.state.paused, isPlaying: this.state.paused }, () => {
			timeout = setTimeout(() => {
				if (!this.state.paused && this.state.controls) {
					// NOTE hide controls if visible and video is playing
					this.toggleControls()
				}
			}, 2500)
		})
	}

	toggleControls = () => {
		clearTimeout(timeout)

		this.setState({ controls: !this.state.controls }, () => {
			Animated.timing(
				this.state.animControlsOpacity,
				{
					toValue: this.state.controls ? 1 : 0,
					duration: 200,
					useNativeDriver: true,
				},
			).start()

			timeout = setTimeout(() => {
				if (!this.state.paused && this.state.controls) {
					// NOTE hide controls if visible and video is playing
					this.toggleControls()
				}
			}, 4000)
		})
	}

	// handle device state
	/* orientationDidChange(sor) {
		const { specificOrientation, previousOrientation } = this.state

		this.setState({
			previousOrientation: specificOrientation,
			specificOrientation: sor,
		})

		if (sor !== 'UNKNOWN' && (previousOrientation || sor !== 'PORTRAIT')) this.onFullScreen()
	}*/

	renderVideoPlayerTimeBar = () => {
		const { currentTime, duration, thumbSize, fullScreen } = this.state
		const { fullScreenSupport } = this.props

		const TIME_BAR_WIDTH = fullScreenSupport ? WIDTH - size(150) : WIDTH - size(120)
		const TIME_BAR_WIDTH_FULL_SCREEN = HEIGHT - size(150)
		const TRACK_HEIGHT = size(4)

		// TODO can we interpolate slider styles?
		const style = {
			marginTop: size(2),
			marginHorizontal: size(10),
			height: null,
			width: fullScreen ? TIME_BAR_WIDTH_FULL_SCREEN : TIME_BAR_WIDTH,
		}

		const thumbStyle = {
			borderRadius: thumbSize,
			height: thumbSize,
			width: thumbSize,
		}

		const trackStyle = {
			borderRadius: 0,
			height: TRACK_HEIGHT,
		}

		return (
			<TouchableWithoutFeedback>
				<View
					style={[styles.timeBarContainer, !fullScreenSupport && {
						right: 0,
						left: 0,
						justifyContent: 'center',
					}]}
				>
					<TransText style={[styles.p, { textAlign: 'right' }]} transkey={formatTime(currentTime)} />
					<VideoPlayerSlider
						value={currentTime}
						maximumValue={duration}
						onValueChange={this.changeCurrentTime}
						onSlidingStart={this.onSlidingStart}
						onSlidingComplete={this.onSlidingComplete}
						minimumTrackTintColor={ss.constants.COLOR_CORE_BRAND}
						maximumTrackTintColor="rgba(255, 255, 255, 0.5)"
						thumbTintColor={ss.constants.COLOR_CORE_BRAND}
						style={style}
						thumbStyle={thumbStyle}
						trackStyle={trackStyle}
						vertical={!!fullScreen}
						orientation={this.state.videoOrientation}
					/>
					<TransText style={styles.p} transkey={formatTime(duration)} />
				</View>
			</TouchableWithoutFeedback>
		)
	}

	renderVideoControls = () => {
		const { paused, currentTime, duration, controls, isLoading, isBuffering } = this.state
		const { fullScreenSupport } = this.props

		const controlsOpacity = this.state.animControlsOpacity.interpolate({
			inputRange: [0, 1],
			outputRange: [0, 1],
		})

		return (
			<TouchableHighlight
				style={{ flex: 1 }}
				activeOpacity={1}
				underlayColor="transparent"
				onPress={this.toggleControls}
			>
				<Animated.View style={[styles.controls, { opacity: controlsOpacity }]}>
					{
						(isLoading || isBuffering)
						? <Loading color="white" />
						: <TouchableHighlight
							style={styles.playButton}
							disabled={!controls}
							activeOpacity={1}
							underlayColor="transparent"
							onPress={this.togglePlay}
						>
							<View>
								<Icon
									name={(!paused && currentTime < duration - 1)
										? 'pause-button'
										: 'play-button'
									}
									size={ss.size(36)}
									color="white"
								/>
							</View>
						</TouchableHighlight>
					}
					{this.renderVideoPlayerTimeBar()}
					{fullScreenSupport &&
						<TouchableHighlight
							style={styles.fullScreenButton}
							disabled={!controls}
							activeOpacity={1}
							underlayColor="transparent"
							onPress={() => this.onFullScreen(true)}
						>
							<View>
								<Icon name="full-screen"
									color="white"
									size={ss.size(22)}
								/>
							</View>
						</TouchableHighlight>
					}
				</Animated.View>
			</TouchableHighlight>
		)
	}

	render() {
		const { source, height, poster } = this.props
		const { rate, volume, muted, paused } = this.state

		const containerHeight = this.state.animFullScreen.interpolate({
			inputRange: [-1, 0, 1],
			outputRange: [HEIGHT, height, HEIGHT],
		})

		const fullScreenRotation = this.state.animFullScreen.interpolate({
			inputRange: [-1, 0, 1],
			outputRange: ['90deg', '0deg', '-90deg'],
		})

		const playerHeight = this.state.animFullScreen.interpolate({
			inputRange: [-1, 0, 1],
			outputRange: [WIDTH, height, WIDTH],
		})

		const playerWidth = this.state.animFullScreen.interpolate({
			inputRange: [-1, 0, 1],
			outputRange: [HEIGHT, WIDTH, HEIGHT],
		})

		const playerLeftOffset = this.state.animFullScreen.interpolate({
			inputRange: [-1, 0, 1],
			outputRange: [0, 0, WIDTH - HEIGHT],
		})

		return (
			<Animated.View style={[styles.container, { position: 'absolute', height: containerHeight, zIndex: 1 }]}>
				<Animated.View style={{ transform: [{ rotate: fullScreenRotation }], zIndex: 1 }}>
					<Animated.View
						style={[styles.player, { height: playerHeight, width: playerWidth, left: playerLeftOffset }]}
					>
						<Video
							ref={(ref) => { this.videoPlayer = ref }}
							style={styles.video}
							source={{ uri: source }}
							poster={Platform.OS === 'ios' ? poster : null} // TODO BUG doesn't work, breaks android
							rate={rate}
							volume={volume}
							muted={muted}
							paused={paused}
							resizeMode="cover"
							repeat={false}
							playInBackground={false}
							playWhenInactive={false}
							// progressUpdateInterval={250}
							onLoadStart={this.onLoadStart}
							onLoad={this.onLoad}
							onProgress={this.onProgress}
							onBuffer={this.onBuffer}
							onEnd={this.onEnd}
							onError={this.onError}
						/>
						{this.renderVideoControls()}
					</Animated.View>
				</Animated.View>
			</Animated.View>
		)
	}
}

VideoPlayer.propTypes = {
	source: PropTypes.string.isRequired,
	poster: PropTypes.string,
	fullScreenSupport: PropTypes.bool,
	height: PropTypes.number,
	onError: PropTypes.func,
}

VideoPlayer.defaultProps = {
	fullScreenSupport: false,
	height: ss.size(210),
}


// StyleSheet
const {
	size,
	typo: { p },
} = ss

const styles = ss.create({
	container: {
		// backgroundColor: 'pink', // NOTE testing flexbox
		width: WIDTH,
		// position: 'absolute',
	},
	player: {
		backgroundColor: 'black',
		// backgroundColor: 'pink', // NOTE testing flexbox
		width: WIDTH,
	},
	controls: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
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
	playButton: {
		backgroundColor: 'transparent',
		// backgroundColor: 'green', // NOTE testing flexbox
		padding: size(20),
	},
	fullScreenButton: {
		backgroundColor: 'transparent',
		// backgroundColor: 'red', // NOTE testing flexbox
		position: 'absolute',
		right: size(0),
		bottom: size(0),
		padding: size(10),
	},
	timeBarContainer: {
		// backgroundColor: 'pink', // NOTE testing flexbox
		backfaceVisibility: 'hidden',
		alignItems: 'center',
		flexDirection: 'row',
		position: 'absolute',
		bottom: size(10),
		left: size(10),
	},
	p: {
		...p,
		backgroundColor: 'transparent',
		color: ss.constants.COLOR_CORE_LIGHT,
		fontSize: size(12),
		width: size(35),
	},
})

export default VideoPlayer
