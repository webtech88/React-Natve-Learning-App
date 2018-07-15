// TODO: Notification bug, svg curve

import React, { Component } from 'react'
import {
	PanResponder,
	View,
	Text,
	Image,
	TouchableOpacity,
	Animated,
	Platform,
} from 'react-native'

import PropTypes from 'prop-types'

import R from 'ramda'
import { Actions as NavigationActions } from 'react-native-router-flux'
import { connect } from 'react-redux'

import moment from 'moment-timezone'

import Svg, { Ellipse } from 'react-native-svg'
import WorkbookActions from '../actions/creator'
import common from '../../common'
import { getSortedNotifications } from '../../core/util/selectors'
import { getCurrentQualification } from '../../user/util/selectors'
import { expectedGraduation } from '../util/helpers'

import ss from '../../styles'

const { ProgressBadge } = common.components.workbook
const {
	Icon,
	Loading,
	NoResults,
	NotificationsListView,
	TransText,
	TransAnimatedText,
} = common.components.core

const WIDTH = ss.constants.WIDTH_DEVICE
const HEIGHT = ss.constants.HEIGHT_DEVICE
const HEIGHT_NAV_BAR = ss.constants.HEIGHT_NAV_BAR


const DASH_PADDING = ss.size(20)
const DASH_WIDTH = WIDTH - (DASH_PADDING * 2)
// const DASH_HEIGHT = ss.size(250)
const DASH_HEIGHT = (HEIGHT - ss.size(150)) / 2

const CURVE_HEIGHT = ss.size(40)
const CURVE_WIDTH = WIDTH + CURVE_HEIGHT

const BUTTON_DIMENSIONS = ss.size(70)
const CALENDAR_DIMENSIONS = ss.size(40)
const BUTTON_MARGIN = (DASH_WIDTH - (BUTTON_DIMENSIONS * 4)) / 3
const PROGRESS_DIMENSIONS = ss.size(200)

class DashboardScreen extends Component {

	state = {
		dashboardToggled: false,
		animImageScale: new Animated.Value(1.2),
		animButtonOneScale: new Animated.Value(0),
		animButtonTwoScale: new Animated.Value(0),
		animButtonThreeScale: new Animated.Value(0),
		animButtonFourScale: new Animated.Value(0),
		panY: new Animated.Value(DASH_HEIGHT),
	}

	componentWillMount() {
		// set initial offset
		this.animatedValueY = this.state.dashboardToggled ? 0 : DASH_HEIGHT

		this.state.panY.addListener(e => this.animatedValueY = e.value)

		// handle touch/drag
		this.panResponder = PanResponder.create({
			onMoveShouldSetResponderCapture: () => true,
			onMoveShouldSetPanResponderCapture: (e, gestureState) => {
				if (gestureState.dx !== 0 && gestureState.dy !== 0) return true
				return false
			},
			onPanResponderGrant: () => {
				this.state.panY.setOffset(parseInt(this.animatedValueY))
				this.state.panY.setValue(0)
			},
			onPanResponderMove: Animated.event([null, { dy: this.state.panY }]),
			onPanResponderRelease: (e, gesture) => {
				this.state.panY.flattenOffset()

				// TODO this doesn't work properly yet
				let animToValue = 0
				if (gesture.dy > 0) {
					// pulling down from initial touch position
					animToValue = DASH_HEIGHT
				} else {
					// pulling up from initial touch position
					animToValue = 0
				}

				// ready to animate?
				this.animatePanRelease(animToValue)
			},
		})
	}

	componentDidMount() {
		const { sectorId } = this.props
		if (sectorId) {
			this.props.getQualifications(sectorId)
		}

		this.animateMount()
	}

	componentWillReceiveProps(nextProps) {
		if (!R.equals(this.props.qualification, nextProps.qualification)) {
			this.animateMount()
		}
	}

	componentWillUnmount() {
		this.state.panY.removeAllListeners()
	}

	animateMount = () => {
		// animate background image
		Animated.spring(this.state.animImageScale, {
			toValue: 1,
			friction: 13,
		}).start()

		// animate buttons
		const animButton = {
			toValue: 1,
			speed: 100,
			bounciness: 10,
		}

		Animated.stagger(200, [
			Animated.delay(500),
			Animated.spring(this.state.animButtonOneScale, animButton),
			Animated.spring(this.state.animButtonTwoScale, animButton),
			Animated.spring(this.state.animButtonThreeScale, animButton),
			Animated.spring(this.state.animButtonFourScale, animButton),
		]).start()
	}

	animatePanRelease = (toValue) => {
		this.setState({ dashboardToggled: !this.state.dashboardToggled })

		Animated.spring(this.state.panY, {
			toValue,
			friction: 13,
		}).start()
	}

	renderNotifications() {
		const { gettingNotifications, notifications, navigateToNotifications } = this.props

		const buttonTranslateY = this.state.panY.interpolate({
			inputRange: [0, (DASH_HEIGHT / 2)],
			outputRange: [0, size(100)],
			extrapolate: 'clamp',
		})

		let rendered = null

		if (notifications && notifications.length) {
			rendered = (
				<View style={{ flex: 1 }}>
					<NotificationsListView
						style={{ paddingBottom: size(30) }}
						contentContainerStyle={styles.notificationsContainer}
						notifications={notifications}
						onPress={() => console.log('What now?')}
					/>
					{(notifications.length === 3) &&
						<Animated.View style={{
							position: 'absolute',
							left: 0,
							right: 0,
							bottom: 0,
							transform: [{ translateY: buttonTranslateY }],
						}}
						>
							<TouchableOpacity
								style={{ paddingVertical: size(20) }}
								activeOpacity={0.8}
								onPress={navigateToNotifications}
							>
								<TransText style={styles.link} transkey="SHOW_ALL" />
							</TouchableOpacity>
						</Animated.View>
					}
				</View>
			)
		} else if (gettingNotifications) {
			rendered = <Loading message="Loading notifications..." />
		} else {
			rendered = <NoResults message="You have 0 notifications" />
		}

		return (
			<View style={styles.notifications}>
				{rendered}
			</View>
		)
	}

	render() {
		const {
			user,
			gettingQualifications,
			qualification,
			navigateToQualification,
			// TODO
			// navigateToProgress,
			navigateToVideos,
			navigateToCreateConversation,
			navigateToCalendar,
			notifications,
			currentScene,
		} = this.props

		// header height: 100 then 265
		const headerHeight = this.state.panY.interpolate({
			inputRange: [size(100), DASH_HEIGHT],
			outputRange: [(size(100) + ss.constants.HEIGHT_NAV_BAR), (DASH_HEIGHT + ss.constants.HEIGHT_NAV_BAR)],
			extrapolate: 'clamp',
		})
		const headerPaddingBottom = this.state.panY.interpolate({
			inputRange: [(DASH_HEIGHT / 2), DASH_HEIGHT],
			outputRange: [(BUTTON_DIMENSIONS / 2), (PROGRESS_DIMENSIONS / 2)],
			extrapolate: 'clamp',
		})
		const headerNameHeight = this.state.panY.interpolate({
			inputRange: [(DASH_HEIGHT / 1.2), DASH_HEIGHT],
			outputRange: [0, 45],
			extrapolate: 'clamp',
		})
		const headerMessageHeight = this.state.panY.interpolate({
			inputRange: [(DASH_HEIGHT / 1.2), DASH_HEIGHT],
			outputRange: [0, 35],
			extrapolate: 'clamp',
		})
		const headerTextOpacity = this.state.panY.interpolate({
			inputRange: [(DASH_HEIGHT / 1.25), DASH_HEIGHT],
			outputRange: [0, 1],
			extrapolate: 'clamp',
		})

		// qualification height: 70 then 265
		const qualHeight = this.state.panY.interpolate({
			inputRange: [0, (BUTTON_DIMENSIONS * 1.1), DASH_HEIGHT],
			outputRange: [(1.5 * BUTTON_DIMENSIONS) + HEIGHT_NAV_BAR, (1.5 * BUTTON_DIMENSIONS) + HEIGHT_NAV_BAR, DASH_HEIGHT * 2],
			extrapolate: 'clamp',
		})

		// qualification margin top: 100 then 265
		const qualMarginTop = this.state.panY.interpolate({
			inputRange: [size(100), DASH_HEIGHT],
			outputRange: [size(100), (DASH_HEIGHT)],
			extrapolate: 'clamp',
		})

		// constants progress
		const progressStartY = -(PROGRESS_DIMENSIONS / 2)
		const progressEndY = -(PROGRESS_DIMENSIONS / 2) - size(10)
		const progressStartX = -(BUTTON_DIMENSIONS) + size(5)
		const progressEndX = (DASH_WIDTH / 2) - (PROGRESS_DIMENSIONS / 2) // center progress horizontally

		// progress
		const progressX = this.state.panY.interpolate({
			inputRange: [size(160), DASH_HEIGHT - BUTTON_DIMENSIONS, DASH_HEIGHT],
			outputRange: [progressStartX, (progressStartX + progressEndX) / 2, progressEndX],
			extrapolate: 'clamp',
		})
		const progressY = this.state.panY.interpolate({
			inputRange: [size(140), (DASH_HEIGHT - BUTTON_DIMENSIONS), DASH_HEIGHT],
			outputRange: [progressStartY, -PROGRESS_DIMENSIONS, progressEndY],
			extrapolate: 'clamp',
		})
		const progressRotate = this.state.panY.interpolate({
			inputRange: [size(140), DASH_HEIGHT],
			outputRange: ['0deg', '360deg'],
			extrapolate: 'clamp',
		})
		const progressDimensions = this.state.panY.interpolate({
			inputRange: [(DASH_HEIGHT - BUTTON_DIMENSIONS), DASH_HEIGHT],
			outputRange: [BUTTON_DIMENSIONS, PROGRESS_DIMENSIONS],
			extrapolate: 'clamp',
		})
		// TODO scale loose quality, BUT can't animate svg...
		const progressScale = this.state.panY.interpolate({
			inputRange: [(DASH_HEIGHT - BUTTON_DIMENSIONS), DASH_HEIGHT],
			outputRange: [(BUTTON_DIMENSIONS / PROGRESS_DIMENSIONS), 1],
			extrapolate: 'clamp',
		})

		// constants button
		const buttonStartY = -(BUTTON_DIMENSIONS / 2)
		const buttonOneStartX = DASH_WIDTH - (BUTTON_DIMENSIONS * 3) - (BUTTON_MARGIN * 2)
		const buttonOneEndX = -size(5)
		const buttonOneEndY = (DASH_HEIGHT / size(250)) * size(25)
		const buttonTwoStartX = DASH_WIDTH - (BUTTON_DIMENSIONS * 2) - BUTTON_MARGIN
		const buttonTwoEndX = (BUTTON_DIMENSIONS / 2) + (BUTTON_MARGIN / 3)
		const buttonTwoEndY = (DASH_HEIGHT / size(250)) * size(110)
		const buttonThreeStartX = DASH_WIDTH - BUTTON_DIMENSIONS
		const buttonThreeEndX = (DASH_WIDTH / 2) - (BUTTON_DIMENSIONS / 2) // center button horizontally
		const buttonThreeEndY = (DASH_HEIGHT / size(250)) * size(150)

		// button one
		const buttonOneX = this.state.panY.interpolate({
			inputRange: [size(150), DASH_HEIGHT],
			outputRange: [buttonOneStartX, buttonOneEndX],
			extrapolate: 'clamp',
		})
		const buttonOneY = this.state.panY.interpolate({
			inputRange: [size(35), DASH_HEIGHT],
			outputRange: [buttonStartY, buttonOneEndY],
			extrapolate: 'clamp',
		})

		// button two
		const buttonTwoX = this.state.panY.interpolate({
			inputRange: [size(170), DASH_HEIGHT],
			outputRange: [buttonTwoStartX, buttonTwoEndX],
			extrapolate: 'clamp',
		})
		const buttonTwoY = this.state.panY.interpolate({
			inputRange: [size(105), DASH_HEIGHT],
			outputRange: [buttonStartY, buttonTwoEndY],
			extrapolate: 'clamp',
		})

		// button three
		const buttonThreeX = this.state.panY.interpolate({
			inputRange: [size(190), DASH_HEIGHT],
			outputRange: [buttonThreeStartX, buttonThreeEndX],
			extrapolate: 'clamp',
		})
		const buttonThreeY = this.state.panY.interpolate({
			inputRange: [size(140), DASH_HEIGHT],
			outputRange: [buttonStartY, buttonThreeEndY],
			extrapolate: 'clamp',
		})

		// button four (calendar)
		const buttonFourOpacity = this.state.panY.interpolate({
			inputRange: [(DASH_HEIGHT - (BUTTON_DIMENSIONS / 3)), DASH_HEIGHT],
			outputRange: [0, 1],
			extrapolate: 'clamp',
		})
		const buttonFourX = this.state.panY.interpolate({
			inputRange: [(DASH_HEIGHT - (BUTTON_DIMENSIONS / 2)), DASH_HEIGHT],
			outputRange: [size(150), 0],
			extrapolate: 'clamp',
		})

		return (
			<View style={styles.wrapper}>
				<View style={styles.logo}>
					<Image source={ss.images.logoIcon} />
				</View>
				<Animated.View style={[
					styles.header, {
						height: headerHeight,
						paddingBottom: headerPaddingBottom,
					},
				]}
				>
					{/* Image size must be 375x330x2 */}
					<Animated.Image
						style={{
							position: 'absolute',
							top: 0,
							right: 0,
							bottom: 0,
							left: 0,
							flex: 1,
							width: null,
							height: null,
							backgroundColor: 'transparent',
							transform: [{ scale: this.state.animImageScale }],
						}}
						resizeMode="cover"
						source={ss.images.imageDashboard}
					/>
					<View style={{
						flex: 1,
						backgroundColor: 'transparent',
						justifyContent: 'center',
						alignItems: 'center',
					}}
					>
						<TransAnimatedText
							style={[
								styles.h1,
								{ opacity: headerTextOpacity, height: headerNameHeight },
							]}
							transkeys={['HI', ' ', user.first_name]}
							tindices={[0]}
							numberOfLines={1}
						/>
						{qualification &&
							<TransAnimatedText
								style={[
									styles.pLight,
									{ opacity: headerTextOpacity, height: headerMessageHeight },
								]}
								transkey={
									qualification.progress_percentage >= 100
									? 'Well done! All complete.'
									: "You're doing great - nearly there."
								}
								numberOfLines={1}
							/>
						}
						{qualification && qualification.short_title &&
							<Text style={styles.p} numberOfLines={2}>{qualification.short_title}</Text>
						}
					</View>
				</Animated.View>


				{/* Dashboard */}
				<View style={styles.dashboardContainer}>
					<View style={styles.dashboard} {...this.panResponder.panHandlers}>
						<Animated.View style={[styles.qualification,
							{
								height: qualHeight,
								paddingTop: qualMarginTop,

							}]}
						>
							{/* Curve */}
							<Animated.View style={[
								styles.svgContainer,
								{ transform: [
									{ translateY: qualMarginTop },
								] }]}
							>
								<Animated.View style={styles.svgBackground} />
								<Svg
									height={CURVE_HEIGHT}
									width={CURVE_WIDTH}
								>
									<Ellipse
										cx={CURVE_WIDTH / 2}
										cy={(CURVE_HEIGHT / 2)}
										rx={CURVE_WIDTH / 2}
										ry={(CURVE_HEIGHT / 2)}
										fill="white"
									/>
								</Svg>
							</Animated.View>
							{qualification
								? <View style={{ flex: 1, alignItems: 'flex-end' }}>
									{/* Progress */}
									<Animated.View style={[styles.progress, {
										width: PROGRESS_DIMENSIONS,
										height: PROGRESS_DIMENSIONS,
										justifyContent: 'center',
										alignItems: 'center',
										transform: [
											{ translateX: progressX },
											{ translateY: progressY },
											{ rotate: progressRotate },
											{ scale: progressScale },
										],
									}]}
									>
										<TouchableOpacity
											style={{
												justifyContent: 'center',
												alignItems: 'center',
												width: PROGRESS_DIMENSIONS,
												height: PROGRESS_DIMENSIONS,
											}}
											activeOpacity={0.95}
											onPress={() => navigateToQualification(qualification.qualification_id)}
										>
											<ProgressBadge
												style={{
													shadowRadius: 1,
													shadowOpacity: 0.1,
													shadowOffset: { height: 1 },
												}}
												dimensions={PROGRESS_DIMENSIONS}
												percentage={qualification.progress_percentage}
												percentageStrokeWidth={size(7)}
												// TODO color variables
												colorPrimary={qualification.progress_percentage >= 100
													? 'white'
													: '#009B85'
												}
												colorSecondary={qualification.progress_percentage >= 100
													? '#009B85'
													: 'white'
												}
												colorStrokeFill="#009B85"
												colorText="#009B85"
												animated
											/>
										</TouchableOpacity>
									</Animated.View>

									{/* Workbooks */}
									<Animated.View style={[styles.button,
										{ transform: [
											{ translateX: buttonOneX },
											{ translateY: buttonOneY },
											{ scale: Platform.OS === 'ios' ? this.state.animButtonOneScale : 1 }],
										}]}
									>
										<TouchableOpacity
											style={styles.buttonContainer}
											activeOpacity={0.95}
											onPress={() => navigateToQualification(qualification.qualification_id)}
										>
											<Icon style={styles.icon}
												name="workbook"
												size={ss.size(22)}
												color={ss.constants.COLOR_ACCENT_ORANGE}
											/>
											<View style={styles.buttonLabel}>
												<TransText style={styles.buttonText} transkey="WORKBOOKS" />
											</View>
										</TouchableOpacity>
									</Animated.View>

									{/* Videos */}
									<Animated.View style={[styles.button,
										{ transform: [
											{ translateX: buttonTwoX },
											{ translateY: buttonTwoY },
											{ scale: Platform.OS === 'ios' ? this.state.animButtonTwoScale : 1 }],
										}]}
									>
										<TouchableOpacity
											style={styles.buttonContainer}
											activeOpacity={0.95}
											onPress={navigateToVideos}
										>
											<Icon style={styles.icon}
												name="videos"
												size={ss.size(26)}
												color={ss.constants.COLOR_ACCENT_ORANGE}
											/>
											<View style={styles.buttonLabel}>
												<TransText style={styles.buttonText} transkey="VIDEOS" />
											</View>
										</TouchableOpacity>
									</Animated.View>

									{/* Tutor */}
									<Animated.View style={[styles.button,
										{ transform: [
											{ translateX: buttonThreeX },
											{ translateY: buttonThreeY },
											{ scale: Platform.OS === 'ios' ? this.state.animButtonThreeScale : 1 }],
										}]}
									>
										<TouchableOpacity
											style={styles.buttonContainer}
											activeOpacity={0.95}
											onPress={navigateToCreateConversation}
										>
											<Icon style={styles.icon}
												name="messages"
												size={ss.size(24)}
												color={ss.constants.COLOR_ACCENT_ORANGE}
											/>
											<View style={styles.buttonLabel}>
												<TransText style={styles.buttonText} transkey="TUTOR" />
											</View>
										</TouchableOpacity>
									</Animated.View>

									{/* Calendar */}
									{qualification.start_date && qualification.guided_learning_hours
										? <Animated.View style={[styles.buttonCalendar, {
											opacity: buttonFourOpacity,
											transform: [
												{ translateX: buttonFourX },
												{ translateY: buttonThreeEndY }, // NOTE align this Y same as lower button
												{ scale: Platform.OS === 'ios' ? this.state.animButtonFourScale : 1 },
											] },
										]}
										>
											<View // NOTE: Was TouchableOpacity
												// activeOpacity={0.95}
												// onPress={navigateToCalendar}
												style={{
													flex: 1,
													// justifyContent: 'space-between',
													justifyContent: 'center',
												}}
											>
												{/* <Image style={styles.calendar}
													source={ss.images.iconDashCalendar}
												>
													<Text style={styles.buttonCalendarDay}>
														{moment().format('D')}
													</Text>
												</Image> */}

												<TransText
													style={[
														styles.buttonText,
														{ marginTop: 0 },
														{ padding: size(10), fontSize: size(12) }, // TODO: Delete when calendar re-added
													]}
													transkeys={['Expected Graduation', ' ', expectedGraduation(qualification.start_date, qualification.guided_learning_hours)]}
													tindices={[0]}
												/>
											</View>
										</Animated.View>
										: null
									}
								</View>
								: gettingQualifications
								? <Loading message="Loading qualification..." />
								: <TransText style={styles.noResults} transkey="No qualifications yet" />
							}
						</Animated.View>
					</View>
				</View>
				{this.renderNotifications()}
			</View>
		)
	}

}

DashboardScreen.propTypes = {
	user: PropTypes.object.isRequired,
	gettingQualifications: PropTypes.bool.isRequired,
	qualification: PropTypes.object,
	gettingNotifications: PropTypes.bool.isRequired,
	notifications: PropTypes.array,
	getQualifications: PropTypes.func.isRequired,
	navigateToQualification: PropTypes.func.isRequired,
	navigateToProgress: PropTypes.func.isRequired,
	navigateToVideos: PropTypes.func.isRequired,
	navigateToCreateConversation: PropTypes.func.isRequired,
	navigateToCalendar: PropTypes.func.isRequired,
	navigateToNotifications: PropTypes.func.isRequired,
}

DashboardScreen.defaultProps = {
	qualification: null,
	notifications: null,
}


// StyleSheet
const {
	size,
	base: { wrapper },
	typo: { h1, p, pLight, pBold, link },
} = ss

const styles = ss.create({
	wrapper: {
		...wrapper,
		// backgroundColor: '#F9F9F9',
		// backgroundColor: 'gray', // NOTE testing flexbox
		paddingTop: 0,
		backgroundColor: 'white',
	},
	logo: {
		position: 'absolute',
		top: size(30),
		left: size(10),
		zIndex: 2,
	},

	// header
	header: {
		backgroundColor: ss.constants.COLOR_CORE_SECONDARY,
		// backgroundColor: 'pink', // NOTE testing flexbox
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		zIndex: 1,
		paddingHorizontal: DASH_PADDING,
		paddingTop: ss.constants.HEIGHT_NAV_BAR,
	},
	h1: {
		...h1,
		color: 'white',
		fontSize: size(34),
		lineHeight: size(40),
		textAlign: 'center',
		backgroundColor: 'transparent',
		// backgroundColor: 'pink', // NOTE testing flexbox
	},
	p: {
		...p,
		color: 'white',
		textAlign: 'center',
		marginHorizontal: size(50),
		marginBottom: size(20),
		backgroundColor: 'transparent',
	},
	pLight: {
		...pLight,
		color: 'white',
		fontSize: size(20),
		textAlign: 'center',
		backgroundColor: 'transparent',
	},
	// dashboard
	dashboardContainer: {
		zIndex: 3,
	},
	dashboard: {
		// backgroundColor: 'pink', // NOTE testing flexbox
		justifyContent: 'flex-end',
		paddingTop: ss.constants.HEIGHT_NAV_BAR,
		zIndex: 1,
	},
	qualification: {
		// backgroundColor: 'pink', // NOTE testing flexbox
		paddingHorizontal: DASH_PADDING,
		borderBottomWidth: 1,
		borderBottomColor: 'rgba(0, 0, 0, 0.1)',
		justifyContent: 'center',
		backgroundColor: 'transparent',
	},
	noResults: {
		...pLight,
		fontSize: size(18),
		textAlign: 'center',
	},
	svgContainer: {
		height: CURVE_HEIGHT,
		position: 'absolute',
		top: -(CURVE_HEIGHT / 2),
		right: 0,
		left: -(CURVE_HEIGHT / 2),
	},
	svgBackground: {
		position: 'absolute',
		top: CURVE_HEIGHT / 2,
		right: 0,
		left: 0,
		height: CURVE_HEIGHT,
		backgroundColor: 'white',
	},
	progress: {
		// opacity: 0,
		backgroundColor: 'white',
		// backgroundColor: 'red', // NOTE testing flexbox
		zIndex: 1,
		position: 'absolute',
		left: 0,
		top: 0,
		width: BUTTON_DIMENSIONS,
		height: BUTTON_DIMENSIONS,
		borderRadius: PROGRESS_DIMENSIONS,
		android: {
			elevation: 2,
		},
	},
	button: {
		backgroundColor: 'white',
		// backgroundColor: 'pink', // NOTE testing flexbox
		zIndex: 1,
		position: 'absolute',
		left: 0,
		top: 0,
		width: BUTTON_DIMENSIONS,
		height: BUTTON_DIMENSIONS,
		borderRadius: BUTTON_DIMENSIONS,
		ios: {
			shadowColor: 'black',
			shadowOffset: {
				height: 1,
			},
			shadowOpacity: 0.15,
			shadowRadius: size(6),
		},
		android: {
			elevation: 5,
		},
	},
	buttonContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: BUTTON_DIMENSIONS,
		borderWidth: 2,
		// TODO color variables
		borderColor: '#009B85',
	},
	icon: {
		marginBottom: size(15),
	},
	buttonLabel: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		justifyContent: 'center',
		alignItems: 'center',
	},
	buttonCalendar: {
		// backgroundColor: 'pink', // NOTE testing flexbox
		width: size(100),
		height: BUTTON_DIMENSIONS,
		borderLeftWidth: 1,
		borderLeftColor: 'rgba(0, 0, 0, 0.1)',
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 2,
	},
	calendar: {
		width: CALENDAR_DIMENSIONS,
		height: CALENDAR_DIMENSIONS,
		alignItems: 'center',
		justifyContent: 'flex-end',
		paddingBottom: size(5),
	},
	buttonCalendarDay: {
		...pBold,
		fontSize: size(12),
		color: ss.constants.COLOR_ACCENT_ORANGE,
	},
	buttonText: {
		...p,
		backgroundColor: 'transparent',
		opacity: 0.6,
		fontSize: size(9),
		textAlign: 'center',
		marginTop: size(25),
	},

	// notifications
	notifications: {
		backgroundColor: '#F4F3F5',
		// backgroundColor: 'pink', // NOTE testing flexbox
		flex: 1,
		justifyContent: 'center',
	},
	notificationsContainer: {
		// backgroundColor: 'pink', // NOTE testing flexbox
		padding: size(20),
		paddingBottom: 0,
	},
	link: {
		...link,
		textAlign: 'center',
	},
})

// Redux mappings


const mapStateToProps = (state) => {
	const user = state.user

	return ({
		user: user.data,
		gettingQualifications: state.qualifications.gettingQualifications,
		qualification: getCurrentQualification(state.qualifications),
		sectorId: user.currentQualification && user.currentQualification.sector_id,
		currentScene: (state.navigation.currentScene && state.navigation.currentScene.name) || null,
		gettingNotifications: state.app.gettingNotifications,
		notifications: R.take(3, getSortedNotifications(state.app) || []),
	})
}

const mapDispatchToProps = dispatch => ({
	getQualifications: sectorId => dispatch(WorkbookActions.getQualificationsAttempt(sectorId)),
	navigateToQualification: (qualificationId) => {
		dispatch(WorkbookActions.setActiveQualificationId(qualificationId))
		NavigationActions.Qualifications()
	},
	navigateToProgress: () => {
		console.log('go to progress')
		// NavigationActions.Progress();
	},
	navigateToVideos: () => {
		NavigationActions.Videos()
	},
	navigateToCreateConversation: () => NavigationActions.CreateConversation(),
	navigateToCalendar: () => {
		NavigationActions.Calendar()
	},
	navigateToNotifications: () => {
		NavigationActions.Notifications()
	},
})


export default connect(mapStateToProps, mapDispatchToProps)(DashboardScreen)
