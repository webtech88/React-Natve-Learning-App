import React, { Component } from 'react'
import {
	View,
	Text,
	Animated,
	Platform,
} from 'react-native'

import { Actions as NavigationActions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient'
import Swiper from 'react-native-swiper'

import ss from '../../styles'
import common from '../../common'
import VideoActions from '../actions/creator'

import VideosCardView from '../components/videos-card-view'

const { CloudinaryImage, Loading, TransText } = common.components.core

const HEIGHT = ss.constants.HEIGHT_DEVICE
const HEIGHT_FEATURED_VIDEOS = ss.size(200)
const HEIGHT_FEATURED_CATEGORY = HEIGHT - HEIGHT_FEATURED_VIDEOS
const WIDTH = ss.constants.WIDTH_DEVICE
const QUARTERWIDTH = WIDTH / 4
const HALFWIDTH = WIDTH / 2
const THREEQUARTERSWIDTH = 3 * QUARTERWIDTH

class VideosScreen extends Component {

	state = {
		swiperDirectionX: 0, // 0 -> left, 1 -> right
		swiperIndex: 0,
		swiperNextIndex: 0, // set early
		swiperOffsetX: 0, // set only onScrollEnd
		animSwiperOffsetX: new Animated.Value(0),
		videoSource: null,
	}

	componentWillMount() {
		this.state.animSwiperOffsetX.addListener((e) => {
			const { swiperDirectionX, swiperIndex, swiperNextIndex, swiperOffsetX } = this.state
			const { categories } = this.props

			if (e.value !== swiperOffsetX) {
				if (e.value < swiperOffsetX) {
					// LEFT SWIPES
					const pointOfReturnLeft = swiperOffsetX - THREEQUARTERSWIDTH
					// Set value of swiperDirectionX to indicate left swiping
					if (swiperDirectionX) {
						this.setState({ swiperDirectionX: 0 })
					}
					// If left swiping possible (disabled when swiperIndex===0)...
					// ... and if distance travelled is three-quarters-screen-width+ to the left
					if (swiperIndex > 0 && (swiperOffsetX - e.value) >= THREEQUARTERSWIDTH) {
						// update swiperNextIndex early so new values are visible
						if (swiperIndex === swiperNextIndex) {
							const nextIndex = swiperIndex - 1
							this.setState({
								swiperNextIndex: nextIndex,
							})
						}
					}
					// If swiperNextIndex has been changed but user decides not to swipe...
					if (e.value > pointOfReturnLeft && swiperIndex !== swiperNextIndex) {
						// ... revert to previous index
						this.setState({ swiperNextIndex: swiperNextIndex + 1 })
					}
				} else {
					// RIGHT SWIPES
					const pointOfReturnRight = swiperOffsetX + THREEQUARTERSWIDTH
					// Set value of swiperDirectionX to indicate right swiping
					if (!swiperDirectionX) {
						this.setState({ swiperDirectionX: 1 })
					}
					// If right swiping possible (disabled when swiperIndex===categories.length)...
					// ... and if distance travelled is three-quarters-screen-width+ to the right
					if (swiperIndex <= categories.length && (e.value - swiperOffsetX) >= THREEQUARTERSWIDTH) {
						// update swiperNextIndex early
						if (swiperIndex === swiperNextIndex) {
							const nextIndex = swiperIndex + 1
							this.setState({
								swiperNextIndex: nextIndex,
							})
						}
					}
					// If swiperNextIndex has been changed but user decides not to swipe...
					if (e.value < pointOfReturnRight && swiperIndex !== swiperNextIndex) {
						// ... revert to previous index
						this.setState({ swiperNextIndex: swiperIndex })
					}
				}
			}
		})
	}

	componentDidMount() {
		const { sectorId, onGetVideoCategoriesAttempt } = this.props

		if (sectorId) {
			onGetVideoCategoriesAttempt(sectorId)
		}
	}

	componentWillUnmount() {
		this.state.animSwiperOffsetX.removeListener()
	}

	onScrollEnd = (e, state) => {
		const { index, offset } = state
		this.setState({
			swiperIndex: index,
			swiperOffsetX: offset.x,
			swiperNextIndex: index,
		})
	}

	renderFeaturedVideos = () => {
		const { gettingCategories, categories } = this.props
		const { swiperIndex, animSwiperOffsetX } = this.state
		let rendered = null

		const translateTextX = animSwiperOffsetX.interpolate({
			inputRange: [
				WIDTH * (swiperIndex - 1), // text is offscreen, left
				WIDTH * (swiperIndex),
				WIDTH * (swiperIndex + 1), // text is offscreen, right
			],
			outputRange: [
				HALFWIDTH, // Moves text to the right as user swipes left
				0,
				-HALFWIDTH, // Moves text to the left as user swipes left
			],
			extrapolate: 'clamp',
		})

		const translateTextXMinusOne = animSwiperOffsetX.interpolate({
			inputRange: [
				(WIDTH * (swiperIndex)) - (QUARTERWIDTH / 2),
				(WIDTH * (swiperIndex)) + (QUARTERWIDTH / 2),
				WIDTH * (swiperIndex + 1),
			],
			outputRange: [
				0,
				HALFWIDTH,
				0,
			],
			extrapolate: 'clamp',
		})

		const translateTextXPlusOne = animSwiperOffsetX.interpolate({
			inputRange: [
				WIDTH * (swiperIndex - 1), // User swipes full distance to left
				(WIDTH * (swiperIndex)) - (QUARTERWIDTH / 2), // User is swiping left
				WIDTH * (swiperIndex + 1),
			],
			outputRange: [
				0, // In place
				-HALFWIDTH, // Offset
				0, // In place
			],
			extrapolate: 'clamp',
		})

		if (categories && categories.length) {
			rendered = (
				<View style={{ flex: 1 }}>
					<Swiper
						index={swiperIndex}
						loop={false}
						directionalLockEnabled
						removeClippedSubviews={false}
						scrollEventThrottle={16}
						bounces  // TODO: Check with designers (false looks better)
						showsVerticalScrollIndicator={false}
						onScroll={Animated.event(
							[{ nativeEvent: { contentOffset: { x: this.state.animSwiperOffsetX } } }],
						)}
						onMomentumScrollEnd={this.onScrollEnd}
						dotColor="rgba(255, 255, 255, 0.3)"
						activeDotColor="white"
						paginationStyle={{ height: 20, top: HEIGHT_FEATURED_CATEGORY / 1.6, bottom: 0 }}
					>
						{categories.map((category, index) => (
							<View key={`Video_Category_${category.video_category_id}`} style={styles.category}>
								{category.cloudinary_image_id && <CloudinaryImage
									style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
									publicId={category.cloudinary_image_id}
									width={WIDTH}
									height={HEIGHT}
									options="cover"
								/>}
								<LinearGradient colors={['rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.7)', 'rgba(0, 0, 0, 1)']}
									style={styles.linearGradient}
								/>
								<Animated.View style={[styles.textContainer, Platform.OS === 'ios' && { transform: [{
									translateX: swiperIndex === index
										? translateTextX
										: (swiperIndex === index - 1
											? translateTextXMinusOne
											: translateTextXPlusOne
										),
								}] }]}
								>
									<TransText numberOfLines={2} style={styles.h1} transkey={category.title} />
									{category.description ? <TransText numberOfLines={3} style={styles.p} transkey={category.description} /> : null}
								</Animated.View>
							</View>
						))}
					</Swiper>

					<View style={styles.featuredVideosList}>
						{this.renderFeaturedVideosList()}
					</View>
				</View>
			)
		} else if (gettingCategories) {
			rendered = <Loading color="white" message="Loading..." />
		} else {
			rendered = <TransText style={styles.featuredEmptyText} transkey="NO_VIDEO" />
		}

		return (
			<View style={styles.featured}>
				{rendered}
			</View>
		)
	}

	renderFeaturedVideosList = () => {
		const {
			categories,
			navigateToVideo,
		} = this.props

		const {
			swiperIndex,
			swiperNextIndex,
			animSwiperOffsetX,
			swiperDirectionX,
			showVideoCardList,
		} = this.state

		const slideInInputRange = [
			// Swipe left
			(swiperIndex - 1) * WIDTH, // back in place
			((swiperIndex - 1) * WIDTH) + QUARTERWIDTH, // start sliding in
			((swiperIndex - 1) * WIDTH) + QUARTERWIDTH, // static
			(swiperIndex) * WIDTH, // static
			// Swipe right
			(swiperIndex) * WIDTH, // static
			((swiperIndex) * WIDTH) + THREEQUARTERSWIDTH, // static
			((swiperIndex) * WIDTH) + THREEQUARTERSWIDTH, // start sliding in
			((swiperIndex + 1)) * WIDTH, // back in place
		]

		const slideInOutputRange = [
			0, HALFWIDTH, 0, 0, // Swipe left
			0, 0, HALFWIDTH, 0, // Swipe right
		]

		const slideIn = animSwiperOffsetX.interpolate({
			inputRange: slideInInputRange,
			outputRange: slideInOutputRange,
			extrapolate: 'clamp',
		})

		const fadeOutFadeInInputRange = [
			// Swipe left
			((swiperIndex - 2) * WIDTH) + WIDTH, // faded back in with swiperNextIndex videos visible
			((swiperIndex - 1) * WIDTH) + ((1 / 4) * WIDTH), //  faded out
			((swiperIndex - 1) * WIDTH) + ((1 / 2) * WIDTH), // begins fade out
			// Swipe right
			((swiperIndex) * WIDTH) + ((1 / 2) * WIDTH), // begins fade out
			((swiperIndex) * WIDTH) + ((3 / 4) * WIDTH), // faded out
			(swiperIndex + 1) * WIDTH, // faded back in with swiperNextIndex videos visible
		]

		const fadeOutFadeInOutputRange = [
			1, 0, 1, // Swipe left
			1, 0, 1, // Swipe right
		]

		const fadeOutFadeIn = animSwiperOffsetX.interpolate({
			inputRange: fadeOutFadeInInputRange,
			outputRange: fadeOutFadeInOutputRange,
			extrapolate: 'clamp',
		})

		if (categories && categories[swiperNextIndex]) {
			const category = categories[swiperNextIndex]
			const videos = category.videos
			const gettingVideos = category.gettingVideos
			let contents = null

			// show loading while getting videos
			if (videos == null || gettingVideos) {
				contents = <Loading style={{ alignSelf: 'center' }} color="white" />
			}

			if (videos && !videos.length) {
				contents = (
					<View style={styles.noCards}>
						<Text style={styles.featuredEmptyText}>No featured videos</Text>
					</View>

				)
			}

			// videos
			if (videos && videos.length) {
				contents = (
					<VideosCardView
						key={`Videos_${category.video_category_id}`}
						width={WIDTH / 2.5}
						videos={videos}
						onPress={navigateToVideo}
					/>
				)
			}

			return (
				<View style={{
					height: HEIGHT_FEATURED_VIDEOS,
				}}
				>
					<Animated.View style={{
						position: 'absolute',
						top: 0,
						right: 0,
						bottom: 0,
						left: 0,
						transform: [{ translateX: slideIn }],
						opacity: fadeOutFadeIn,

					}}
					>
						{contents}
					</Animated.View>
				</View>
			)
		}

		return null
	}

	render() {
		const { activeTabIndex } = this.props

		return (activeTabIndex === 0) ? this.renderFeaturedVideos() : null
	}

}


// StyleSheet
const {
	size,
	typo: { h1, p, pLight },
} = ss

const styles = ss.create({
	// featured videos
	featured: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'black',
	},
	featuredEmptyText: {
		...pLight,
		color: 'white',
		fontSize: size(18),
	},
	category: {
		flex: 1,
	},
	linearGradient: {
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
	},
	textContainer: {
		height: HEIGHT_FEATURED_CATEGORY / 1.6,
		justifyContent: 'flex-end',
		paddingHorizontal: size(20),
		paddingBottom: size(20),
	},
	h1: {
		...h1,
		fontSize: size(36),
		textAlign: 'center',
		color: 'white',
		marginBottom: size(10),
	},
	p: {
		...p,
		textAlign: 'center',
		color: 'white',
	},
	featuredVideosList: {
		position: 'absolute',
		zIndex: 1,
		left: 0,
		right: 0,
		bottom: 0,
	},
	noCards: {
		flex: 1,
		backgroundColor: 'transparent',
		alignItems: 'center',
		justifyContent: 'center',
	},
})

// Redux mappings
const mapStateToProps = (state) => {
	const { video } = state
	const { currentQualification } = state.user

	return {
		sectorId: currentQualification && currentQualification.sector_id,
		gettingCategories: video.gettingCategories,
		categories: video.data,
	}
}

const mapDispatchToProps = dispatch => ({
	onGetVideoCategoriesAttempt: (sectorId) => {
		dispatch(VideoActions.getVideoCategoriesAttempt(sectorId))
	},
	onGetCategoryVideosAttempt: (index, category_id) => {
		dispatch(VideoActions.getCategoryVideosAttempt(index, category_id))
	},
	navigateToVideo: (mediaId, videoCategoryId) => {
		NavigationActions.Video({ mediaId, videoCategoryId })
	},
})

export default connect(mapStateToProps, mapDispatchToProps)(VideosScreen)
