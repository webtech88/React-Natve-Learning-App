import PropTypes from 'prop-types'
// TODO: Progress badge

import React, { Component } from 'react'
import {
	View,
	Text,
	TouchableOpacity,
	Animated,
	Platform,
	InteractionManager,
} from 'react-native'

import Carousel from 'react-native-snap-carousel'

import common from '../../common'
import WorkbookCover from './workbook-cover'

import ss from '../../styles'

const { ProgressBadge } = common.components.workbook
const { Button, DraftRenderer, DropShadow, TransText } = common.components.core

// Scroll constants
const WIDTH = ss.constants.WIDTH_DEVICE
const WIDTH_HALF = WIDTH / 2

const HEIGHT = ss.constants.HEIGHT_DEVICE - ss.constants.HEIGHT_NAV_BAR
const HEIGHT_HALF = HEIGHT / 2

// Carousel constants
const CARD_PADDING_HORIZONTAL = ss.size(12)
const CARD_WIDTH = WIDTH_HALF // TODO

const CAROUSEL_MARGIN_TOP = ss.size(20)
const CAROUSEL_MARGIN_BOTTOM = ss.size(30)
const CAROUSEL_WIDTH = WIDTH_HALF + (CARD_PADDING_HORIZONTAL * 2)
const CAROUSEL_HEIGHT = HEIGHT_HALF - CAROUSEL_MARGIN_TOP - CAROUSEL_MARGIN_BOTTOM


class WorkbooksCardView extends Component {

	state = {
		animateProgress: false,
		carouselDirectionX: 0, // 0 -> left, 1 -> right
		carouselIndex: 0,
		carouselNextIndex: 0,
		carouselOffsetX: 0,
		animCarouselOffsetX: new Animated.Value(0),
		animWorkbookInfoOffsetY: new Animated.Value(0),
		animWorkbookInfoTranslateY: new Animated.Value(HEIGHT_HALF),
		animWorkbookInfoTranslateX: new Animated.Value(WIDTH),
	}

	componentWillMount() {
		this.state.animCarouselOffsetX.addListener((e) => {
			const { carouselDirectionX, carouselIndex, carouselNextIndex, carouselOffsetX } = this.state

			if (e.value !== carouselOffsetX) {
				const { workbooks } = this.props
				const threshold = (CAROUSEL_WIDTH / 2)

				// set swiper direction (left, right) only when it changes
				if (e.value < carouselOffsetX) {
					// swiping left
					if (carouselDirectionX) {
						this.setState({ carouselDirectionX: 0 })
					}

					// set swiper next index early so can swap workbook info as we swipe
					if (carouselIndex > 0 && (carouselOffsetX - e.value) >= threshold) {
						if (carouselIndex === carouselNextIndex) {
							const nextIndex = carouselIndex - 1
							this.setState({ carouselNextIndex: nextIndex })
						}
					} else {
						if (carouselIndex > carouselNextIndex) {
							this.setState({ carouselNextIndex: carouselIndex })
						}
					}
				} else {
					// swiping right
					if (!carouselDirectionX) {
						this.setState({ carouselDirectionX: 1 })
					}

					// set swiper next index early so can swap workbook info as we swipe
					if (carouselIndex < workbooks.length && (e.value - carouselOffsetX) >= threshold) {
						if (carouselIndex === carouselNextIndex) {
							const nextIndex = carouselIndex + 1
							this.setState({ carouselNextIndex: nextIndex })
						}
					} else {
						if (carouselIndex < carouselNextIndex) {
							this.setState({ carouselNextIndex: carouselIndex })
						}
					}
				}
			}
		})
	}

	componentDidMount() {
		if (this.props.visible) {
			this.animateIn()
		}
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.visible !== nextProps.visible) {
			if (nextProps.visible) {
				this.animateIn()
			} else {
				// NOTE container will pop after animated out
				this.animateOut(this.props.onUnmount)
			}
		}
	}

	componentWillUnmount() {
		this.state.animCarouselOffsetX.removeListener()
	}

	setCarouselIndex = (slideIndex) => {
		InteractionManager.runAfterInteractions(() => {
			this.setState({
				carouselIndex: slideIndex,
				carouselNextIndex: slideIndex,
				carouselOffsetX: this.carousel._positions[slideIndex].start,
			})
		})
	}

	animateIn = () => {
		const spring = Animated.spring

		// animate info in
		Animated.parallel([
			spring(this.state.animWorkbookInfoTranslateY, {
				toValue: 0,
				friction: 10,
			}),
			spring(this.state.animWorkbookInfoTranslateX, {
				toValue: 0,
				friction: 10,
			}),
		]).start()

		this.setState({ animateProgress: true })
	}

	animateOut = (callback) => {
		const timing = Animated.timing

		// animate info out of viewport
		Animated.parallel([
			timing(this.state.animWorkbookInfoTranslateY, {
				toValue: HEIGHT_HALF,
				duration: 200,
			}),
			timing(this.state.animWorkbookInfoTranslateX, {
				toValue: WIDTH,
				duration: 200,
			}),
		]).start(animated => animated.finished && callback())
	}

	renderWorkbookCarousel(workbooks) {
		const { onPress } = this.props
		const { carouselDirectionX, carouselIndex, carouselOffsetX } = this.state

		const itemWidth = CARD_WIDTH + (2 * CARD_PADDING_HORIZONTAL)

		let swiperZindex
		let animSwiperTranslateY

		if (Platform.OS === 'ios') {
			swiperZindex = this.state.animWorkbookInfoOffsetY.interpolate({
				inputRange: [0, 1],
				outputRange: [1, 0],
				extrapolate: 'clamp',
			})
		} else {
			animSwiperTranslateY = this.state.animWorkbookInfoOffsetY.interpolate({
				inputRange: [0, HEIGHT_HALF],
				outputRange: [0, -HEIGHT_HALF],
				extrapolate: 'clamp',
			})
		}

		return (
			<Animated.View
				style={[
					styles.swiper,
					{ transform: [{ translateX: this.state.animWorkbookInfoTranslateX }] },
					Platform.OS === 'ios'
						? { zIndex: swiperZindex }
						: { transform: [{ translateY: animSwiperTranslateY }] },
				]}
			>
				<View style={{ flex: 1 }}>
					<Carousel
						ref={(c) => { this.carousel = c }}
						activeSlideOffset={0}
						sliderWidth={WIDTH}
						itemWidth={itemWidth}
						firstItem={0}
						inactiveSlideScale={0.95}
						showsHorizontalScrollIndicator={false}
						decelerationRate="fast" // NOTE: Slightly improves experience on iOS
						onScroll={Animated.event([{ nativeEvent: {
							contentOffset: { x: this.state.animCarouselOffsetX },
						} }])}
						onSnapToItem={this.setCarouselIndex}
						scrollEventThrottle={16}
						swipeThreshold={(CAROUSEL_WIDTH / 2)}
						directionalLockEnabled
					>
						{workbooks.map((workbook, index) => {
							let slideStyles

							// NOTE Can't animate on android
							if (Platform.OS === 'ios') {
								// let bgColor = 'white'
								let rotate = '0deg'
								let translateX = 0

								if (carouselIndex === index) {
									// current
									// bgColor = 'red'
									rotate = '0deg'

									if (carouselDirectionX) {
										rotate = '-5deg'
									} else {
										rotate = '5deg'
									}
								} else {
									if (carouselIndex > index) {
										// prev
										// bgColor = 'blue'
										rotate = '-5deg'
										translateX = -50
									} else {
										// next
										// bgColor = 'green'
										rotate = '5deg'
										translateX = 50
									}
								}

								const inputRange = [
									carouselOffsetX - (CARD_WIDTH + (2 * CARD_PADDING_HORIZONTAL)), // reset
									carouselOffsetX - ((CARD_WIDTH + (2 * CARD_PADDING_HORIZONTAL)) / 2), // on left
									carouselOffsetX, // default before scroll
									carouselOffsetX + ((CARD_WIDTH + (2 * CARD_PADDING_HORIZONTAL)) / 2), // on right
									carouselOffsetX + (CARD_WIDTH + (2 * CARD_PADDING_HORIZONTAL)), // reset
								]

								const outputRangeRotate = ['0deg', rotate, '0deg', rotate, '0deg']
								const outputRangeTranslateX = [0, translateX, 0, translateX, 0]

								const workbookRotate = this.state.animCarouselOffsetX.interpolate({
									inputRange,
									outputRange: outputRangeRotate,
									extrapolate: 'clamp',
								})

								const workbookTranslateX = this.state.animCarouselOffsetX.interpolate({
									inputRange,
									outputRange: outputRangeTranslateX,
									extrapolate: 'clamp',
								})

								slideStyles = {
									transform: [
										{ rotate: workbookRotate },
										{ translateX: workbookTranslateX },
									],
								}
							}

							return (
								<Animated.View
									key={`Workbook_${workbook.workbook_id}_Cover`}
									style={[styles.workbook, slideStyles]}
								>
									<View style={styles.progressBadge}>
										<ProgressBadge
											style={styles.badge}
											dimensions={size(50)}
											percentage={
												(this.state.animateProgress || index > 0)
												? workbook.progress_percentage : 0
											}
											animated={!index}
										/>
									</View>
									<TouchableOpacity
										activeOpacity={0.9}
										onPress={() => onPress(workbook.workbook_id)}
									>
										<WorkbookCover
											width={WIDTH_HALF}
											height={CAROUSEL_HEIGHT}
											workbook={workbook}
											style={styles.workbookCover}
										/>
										{Platform.OS === 'ios' && <DropShadow width={CARD_WIDTH - ss.size(50)} />}
									</TouchableOpacity>
								</Animated.View>
							)
						})}
					</Carousel>
				</View>
			</Animated.View>
		)
	}

	renderWorkbookInfo(workbook) {
		const { carouselDirectionX, carouselOffsetX } = this.state
		let infoInputRange = [0, 0, 0]

		if (carouselDirectionX) {
			infoInputRange = [
				carouselOffsetX,
				carouselOffsetX + (CAROUSEL_WIDTH / 2),
				carouselOffsetX + CAROUSEL_WIDTH,
			]
		} else {
			infoInputRange = [
				carouselOffsetX - CAROUSEL_WIDTH,
				carouselOffsetX - (CAROUSEL_WIDTH / 2),
				carouselOffsetX,
			]
		}

		// animate HEIGHT_HALF in/out
		const infoOutputRange = [0, HEIGHT_HALF, 0]

		const infoTranslateY = this.state.animCarouselOffsetX.interpolate({
			inputRange: infoInputRange,
			outputRange: infoOutputRange,
			extrapolate: 'clamp',
		})

		const headerMarginLeft = this.state.animWorkbookInfoOffsetY.interpolate({
			inputRange: [0, HEIGHT_HALF],
			outputRange: [-size(101), 0],
			extrapolate: 'clamp',
		})

		const headerCoverOpacity = this.state.animWorkbookInfoOffsetY.interpolate({
			inputRange: [0, HEIGHT_HALF],
			outputRange: [0, 1],
			extrapolate: 'clamp',
		})

		return (
			<Animated.ScrollView
				ref={(c) => { this.infoScroll = c }}
				style={[styles.infoScroll, { transform: [{ translateY: this.state.animWorkbookInfoTranslateY }] }]}
				contentContainerStyle={styles.infoScrollContainer}
				directionalLockEnabled
				scrollEventThrottle={16}
				bounces={false}
				showsVerticalScrollIndicator={false}
				onScroll={Animated.event([{ nativeEvent:
					{ contentOffset: { y: this.state.animWorkbookInfoOffsetY } },
				}])}
			>
				<Animated.View style={[styles.infoContainer,
					{ transform: [{ translateY: infoTranslateY }] }]}
				>
					<Animated.View style={[styles.header, { marginLeft: headerMarginLeft }]}>
						<Animated.View style={{ marginRight: size(20), opacity: headerCoverOpacity }}>
							<WorkbookCover
								width={size(80)}
								height={size(110)}
								workbook={workbook}
							/>
							<ProgressBadge
								style={{ alignSelf: 'center', marginTop: -size(22) }}
								dimensions={size(30)}
								percentage={workbook.progress_percentage}
							/>
						</Animated.View>
						<View style={{ flex: 1 }}>
							<Text style={styles.h1}>{workbook.title}</Text>
							{workbook.guided_learning_hours
								? <TransText 
										style={styles.pSmall}
										transkeys={['GUIDED_LEARNING_HOURS', ' ', workbook.guided_learning_hours]}
										tindices={[0]}
									/>
								: null
							}
							<TransText 
								style={[styles.pSmall, { color: ss.constants.COLOR_LINK }]}
								transkeys={['CREDIT_VALUE', ' ', workbook.credit_value || 0]}
								tindices={[0]}
							/>
						</View>
					</Animated.View>
					{workbook.overview &&
						<View style={{ paddingBottom: size(20) }}>
							<DraftRenderer key={`UnitOverview_${workbook.unit_id}`} content={workbook.overview} />
						</View>
					}
				</Animated.View>
			</Animated.ScrollView>
		)
	}

	renderWorkbookButton(workbook) {
		const { onPress } = this.props

		const buttonOpacity = this.state.animWorkbookInfoOffsetY.interpolate({
			inputRange: [0, ss.constants.HEIGHT_BUTTON_LARGE],
			outputRange: [0, 1],
			extrapolate: 'clamp',
		})

		const buttonTranslateY = this.state.animWorkbookInfoOffsetY.interpolate({
			inputRange: [0, ss.constants.HEIGHT_BUTTON_LARGE],
			outputRange: [ss.constants.HEIGHT_BUTTON_LARGE, 0],
			extrapolate: 'clamp',
		})

		return (
			<Animated.View style={[styles.button,
				{ opacity: buttonOpacity, transform: [{ translateY: buttonTranslateY }] }]}
			>
				<Button
					label="Open Workbook"
					borderRadius={0}
					onPress={() => onPress(workbook.workbook_id)}
				/>
			</Animated.View>
		)
	}

	render() {
		const { workbooks, contactCentre } = this.props
		const { carouselNextIndex } = this.state

		if (workbooks && workbooks.length) {
			return (
				<View style={styles.wrapper}>

					{/* carousel */}
					{this.renderWorkbookCarousel(workbooks)}

					{/* Workbook info & button */}
					{workbooks[carouselNextIndex] && this.renderWorkbookInfo(workbooks[carouselNextIndex])}
					{workbooks[carouselNextIndex] && this.renderWorkbookButton(workbooks[carouselNextIndex])}

				</View>
			)
		}

		return (
			<View style={styles.wrapper}>
				<View style={styles.empty}>
					<Text style={styles.emptyTitle}>No workbooks yet</Text>
					<Text style={styles.emptyMessage}>
						Your Training Centre is yet to assign workbooks to you. Please check back soon.
					</Text>
					{contactCentre && (
						<Button style={styles.contactButton} label="Contact centre" onPress={contactCentre} />
					)}
				</View>
			</View>
		)
	}
}

WorkbooksCardView.propTypes = {
	visible: PropTypes.bool,
	workbooks: PropTypes.array.isRequired,
	onPress: PropTypes.func.isRequired,
	onUnmount: PropTypes.func.isRequired,
	contactCentre: PropTypes.func,
}

WorkbooksCardView.defaultProps = {
	visible: false,
	contactCentre: null,
}

// StyleSheet
const {
	size,
	base: { wrapper },
	typo: { h1, p, pLight },
} = ss

const styles = ss.create({
	wrapper: {
		...wrapper,
		// backgroundColor: 'pink', // NOTE testing flexbox
		// backgroundColor: '#F9F9F9',
		paddingTop: 0,
		marginTop: ss.constants.HEIGHT_NAV_BAR,
	},
	empty: {
		backgroundColor: '#F4F3F5',
		flex: 1,
		justifyContent: 'center',
		padding: size(20),
	},
	emptyTitle: {
		...h1,
		marginBottom: size(10),
	},
	emptyMessage: {
		...pLight,
		fontSize: size(18),
	},
	// Swiper
	swiper: {
		// backgroundColor: 'green', // NOTE testing flexbox
		position: 'absolute',
		zIndex: 1,
		left: 0,
		top: 0,
		bottom: HEIGHT_HALF,
		right: 0,
		overflow: 'hidden',
	},
	swiperContainer: {
		overflow: 'visible',
		// TODO BUG Swiper bug as style is duplicated to both scrollview & contentContainerStyle
		// paddingTop: CAROUSEL_MARGIN_TOP / 2
	},
	workbook: {
		flex: 1,
		marginTop: CAROUSEL_MARGIN_TOP,
		paddingHorizontal: CARD_PADDING_HORIZONTAL,
	},
	workbookCover: {
		android: {
			elevation: 2,
		},
	},
	// Content scroll
	infoScroll: {
		// backgroundColor: 'pink', // NOTE testing flexbox,
		flex: 1,
	},
	infoScrollContainer: {
		paddingTop: HEIGHT_HALF,
	},
	infoContainer: {
		// backgroundColor: 'pink', // NOTE testing flexbox
		backgroundColor: 'white',
		paddingTop: size(30),
		paddingBottom: size(ss.constants.HEIGHT_BUTTON_LARGE + 10),
		paddingHorizontal: size(20),
		minHeight: HEIGHT,
	},
	header: {
		// backgroundColor: 'gray', // NOTE testing flexbox
		flexDirection: 'row',
		marginBottom: size(30),
	},
	h1: {
		...h1,
		marginBottom: size(10),
	},
	pSmall: {
		...p,
		fontSize: size(12),
	},
	button: {
		position: 'absolute',
		zIndex: 1,
		left: 0,
		bottom: 0,
		right: 0,
	},
	contactButton: {
		paddingTop: 20,
	},
	progressBadge: {
		position: 'absolute',
		bottom: size(8),
		left: (WIDTH_HALF / 2) - size(15),
		ios: {
			zIndex: 1,
		},
	},
})

export default WorkbooksCardView
