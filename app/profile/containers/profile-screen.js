import React, { Component } from 'react'
import {
	PanResponder,
	StatusBar,
	View,
	Text,
	TouchableOpacity,
	Animated,
	LayoutAnimation,
	InteractionManager,
	Platform,
} from 'react-native'

import PropTypes from 'prop-types'

import R from 'ramda'
import { Actions as NavigationActions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import Svg, { Polyline } from 'react-native-svg'

import CoreActions from '../../core/actions/creator'
import ProfileActions from '../actions/creator'
import ss from '../../styles'
import common from '../../common'
import showreel from '../components/showreel'
import profileCard from '../components/profile-card'
import ProfileNavBar from '../components/profile-navbar'
import ProfileCardView from '../components/profile-card-view'

const { Icon, Loading } = common.components.core
const { NavBarIconButton } = common.components.navigation

const {
	ShowreelBackground,
	ShowreelQualification,
	ShowreelInfo,
} = showreel

const {
	ProfileCardMedia,
	ProfileCardExperience,
	ProfileCardEducation,
	ProfileCardReferences,
	ProfileCardBadges,
} = profileCard

const LayoutSpringAnim = {
	// duration: 350,
	duration: 2000,
	create: {
		type: LayoutAnimation.Types.linear,
		property: LayoutAnimation.Properties.opacity,
	},
	update: {
		type: LayoutAnimation.Types.spring,
		property: LayoutAnimation.Properties.opacity,
		springDamping: 1.4,
	},
	delete: {
		type: LayoutAnimation.Types.linear,
		property: LayoutAnimation.Properties.opacity,
	},
}

const WIDTH = ss.constants.WIDTH_DEVICE
const HEIGHT = ss.constants.HEIGHT_DEVICE
const HEIGHT_NAV_BAR = ss.constants.HEIGHT_NAV_BAR
const HEIGHT_STATUS_BAR = ss.constants.HEIGHT_STATUS_BAR
const SCREEN_MARGIN = ss.size(50)
const SCREEN_HEIGHT = HEIGHT - SCREEN_MARGIN
const SWIPER_WIDTH = WIDTH - ss.size(40)
const SWIPER_HEIGHT = SCREEN_HEIGHT - HEIGHT_NAV_BAR

class ProfileScreen extends Component {

	constructor(props) {
		super(props)

		const { showreelOpen } = this.props

		this.state = {
			showreelOpen,
			showreelInfoOpen: false,
			showreelPullTranslateY: new Animated.Value(0),
			panY: new Animated.Value(!showreelOpen ? SCREEN_HEIGHT : 0),
			animateProgress: false,
		}
	}

	componentWillMount() {
		const { showreelOpen } = this.state

		// set initial offset
		this.animPanY = !showreelOpen ? SCREEN_HEIGHT : 0

		// update offset from state
		this.state.panY.addListener((value) => {
			// update status bar style
			if (value.value > (ss.constants.HEIGHT_STATUS_BAR / 2)) {
				StatusBar.setBarStyle('dark-content')
			} else {
				StatusBar.setBarStyle('light-content')
			}

			// update panY value
			this.animPanY = Math.max(0, value.value)
		})

		// handle touch/drag
		this.panResponder = PanResponder.create({
			onMoveShouldSetResponderCapture: () => true,
			onMoveShouldSetPanResponderCapture: (e, gestureState) => {
				// console.log('capture')
				if (gestureState.dx !== 0 && gestureState.dy !== 0) {
					if (this.state.showreelOpen) {
						// allow pan only top half of the screen
						if (e.nativeEvent.pageY < (HEIGHT / 2)) {
							return true
						}
					} else {
						// allow pan only bottom of the screen
						if (e.nativeEvent.pageY > SCREEN_HEIGHT) {
							return true
						}
					}
				}

				return false
			},
			onPanResponderGrant: (e) => {
				// console.log('grant')
				this.state.panY.setOffset(this.animPanY)
				this.state.panY.setValue(0)
			},
			onPanResponderMove: Animated.event([null, { dy: this.state.panY }]),
			onPanResponderRelease: () => {
				this.state.panY.flattenOffset()

				let toValue = 0
				if (this.state.showreelOpen && (this.animPanY > SCREEN_MARGIN)) {
					toValue = SCREEN_HEIGHT
				}

				// ready to animate?
				this.animate(toValue)
			},
		})
	}

	componentDidMount() {
		InteractionManager.runAfterInteractions(() => {
			this.setState({ animateProgress: true })

			this.props.getProfile()
			this.props.getProfilePhotos()
			this.props.getProfileVideos()
			this.props.getProfileBio()
			this.props.getProfileReferences()

			// light status bar if showreelOpen
			if (!this.state.showreelOpen) {
				NavigationActions.refresh({
					key: this.props.sceneKey,
					lightStatusBarContent: false,
				})

				// TODO show user you can pull down?
				Animated.sequence([
					Animated.delay(2000),
					Animated.timing(this.state.showreelPullTranslateY, {
						toValue: 5,
						duration: 250,
					}),
					Animated.spring(this.state.showreelPullTranslateY, {
						toValue: 0,
						friction: 6,
					}),
					Animated.delay(500),
					Animated.timing(this.state.showreelPullTranslateY, {
						toValue: 5,
						duration: 250,
					}),
					Animated.spring(this.state.showreelPullTranslateY, {
						toValue: 0,
						friction: 6,
					}),
				]).start()
			}
		})
	}

	componentWillReceiveProps(nextProps) {
		// reload profile
		if (this.props.memberId !== nextProps.memberId) {
			this.props.unsetConnectionProfile()
			InteractionManager.runAfterInteractions(() => {
				this.props.getProfile()
				this.props.getProfilePhotos()
				this.props.getProfileVideos()
				this.props.getProfileBio()
				this.props.getProfileReferences()
			})
		}

		// update status bar if not correct
		if (nextProps.showreelOpen && !nextProps.lightStatusBarContent) {
			NavigationActions.refresh({
				key: this.props.sceneKey,
				lightStatusBarContent: true,
			})
		} else if (!nextProps.showreelOpen && nextProps.lightStatusBarContent) {
			NavigationActions.refresh({
				key: this.props.sceneKey,
				lightStatusBarContent: false,
			})
		}
	}

	componentWillUnmount() {
		this.state.panY.removeAllListeners()
		// NOTE Connection profile only
		this.props.unsetConnectionProfile()
	}

	animate(toValue) {
		// update showreel status
		this.setState({ showreelOpen: !toValue })
		this.props.toggleShowreel(!toValue)

		// animate showreel
		Animated.spring(this.state.panY, {
			toValue,
			friction: 10,
		}).start()
	}

	toggleShowreelInfo = () => {
		LayoutAnimation.configureNext(LayoutSpringAnim)
		this.setState({ showreelInfoOpen: !this.state.showreelInfoOpen })
	}

	renderShowreel() {
		const {
			profileType,
			profile,
			currentQualification,
			navigateToSettingsPersonalInfo,
			openDrawer,
		} = this.props
		const {
			screen_name: screenName,
			personal_statement: personalStatement,
		} = profile
		const {
			centre_name: centreName,
			short_title: qualificationTitle,
			level: qualificationLevel,
			progress_percentage: qualificationProgress,
		} = currentQualification

		let navBarProps
		let qualificationProps

		if (R.equals('user', profileType)) {
			navBarProps = { onRight: () => openDrawer() }
		} else {
			navBarProps = { onLeft: () => {
				this.state.panY.removeAllListeners()
				NavigationActions.pop()
			} }
		}

		if (profile) {
			if (R.equals('user', profileType)) {
				qualificationProps = {
					progress: this.state.animateProgress ? (qualificationProgress || 0) : 0,
				}
			} else {
				navBarProps = {
					...navBarProps,
					title: `${profile.first_name}'s Profile`,
				}
			}
		}

		const topBarOpacity = this.state.panY.interpolate({
			inputRange: [0, (HEIGHT - (SCREEN_MARGIN * 2)), SCREEN_HEIGHT],
			outputRange: [0, 0, 1],
			extrapolate: 'clamp',
		})

		const showreelNavBarOpacity = this.state.panY.interpolate({
			inputRange: [0, HEIGHT_STATUS_BAR, SCREEN_HEIGHT],
			outputRange: [1, 0, 0],
			extrapolate: 'clamp',
		})

		return (
			<View style={styles.showreel}>
				<Animated.View style={[styles.showreelTopBar, { opacity: topBarOpacity }]}>
					<TouchableOpacity
						style={styles.showreelTopBarContainer}
						activeOpacity={0.8}
						onPress={() => this.animate(0)}
					>
						<Text style={styles.showreelTopBarTitle}>{screenName}</Text>
						<Svg
							style={{ opacity: 0.5 }}
							height={8}
							width={16}
						>
							<Polyline
								points="0,7 8,2 16,7"
								fill="none"
								x={0}
								y={0}
								stroke="white"
								strokeWidth={1}
							/>
						</Svg>
					</TouchableOpacity>
				</Animated.View>
				<View style={styles.showreelPull}>
					<TouchableOpacity
						style={{ padding: size(20) }}
						activeOpacity={0.8}
						onPress={() => this.animate(SCREEN_HEIGHT)}
					>
						<Animated.View
							style={{ transform: [{ translateY: this.state.showreelPullTranslateY }] }}
						>
							<Svg
								style={{ opacity: 0.5 }}
								height={8}
								width={16}
							>
								<Polyline
									points="0,1 8,6 16,1"
									fill="none"
									x={0}
									y={0}
									stroke="white"
									strokeWidth={1}
								/>
							</Svg>
						</Animated.View>
					</TouchableOpacity>
				</View>
				<View style={{ flex: 1 }}>
					<View style={styles.showreelHeader}>
						<Text style={styles.showreelTitle}>{screenName}</Text>
						{!this.state.showreelInfoOpen && centreName && (
							<Text style={styles.showreelSubtitle}>{centreName}</Text>
						)}
					</View>
					<View style={styles.showreelContent}>
						{qualificationTitle && (
							<ShowreelQualification
								title={qualificationTitle}
								level={qualificationLevel || 1}
								{...qualificationProps}
							/>)
						}
						{personalStatement && (
							<View style={{ flex: this.state.showreelInfoOpen ? 1 : 0 }}>
								<ShowreelInfo
									content={personalStatement.toString()}
									toggled={this.state.showreelInfoOpen}
									onToggle={this.toggleShowreelInfo}
								/>
							</View>
						)}
						{R.equals('user', profileType) && (
							<View style={styles.showreelEdit}>
								<TouchableOpacity
									activeOpacity={0.8}
									onPress={navigateToSettingsPersonalInfo}
								>
									<Icon name="edit" color="white" size={ss.size(40)} />
								</TouchableOpacity>
							</View>
						)}
					</View>
				</View>
				{Platform.OS === 'android' &&
					<Animated.View style={[styles.androidNavBar, { opacity: showreelNavBarOpacity }]}>
						<ProfileNavBar
							title={R.equals('user', profileType) ? 'My Profile' : 'Profile'}
							titleStyle={{ color: 'white' }}
							iconStyle={{ opacity: 0 }}
							iconWhiteStyle={{ opacity: 1 }}
							{...navBarProps}
						/>
					</Animated.View>
				}
			</View>
		)
	}

	renderOverlay = () => {
		const {
			// profile
			profileType,
			gettingProfile,
			profile,
		} = this.props
		if (Platform.OS === 'ios') { // TODO Fix loading on Android
			if (!profile) {
				return <Loading color="white" />
			}

			if (gettingProfile) {
				return <Loading color="white" message="Loading profile..." />
			}
		}

		if (profile) {
			return this.renderShowreel()
		}

		return null
	}


	render() {
		const {
			// profile
			profileType,
			gettingProfile,
			profile,
			openDrawer,
			// photos
			gettingPhotos,
			photos,
			navigateToProfilePhotos,
			navigateToProfilePhoto,
			navigateToProfilePhotoForm,
			// videos
			gettingVideos,
			videos,
			navigateToProfileVideos,
			navigateToProfileVideo,
			navigateToProfileVideoForm,
			// bio
			gettingBio,
			experience,
			education,
			navigateToProfileExperience,
			navigateToProfileEducation,
			navigateToProfileAddBio,
			// references
			gettingReferences,
			references,
			navigateToProfileReferences,
			navigateToProfileReferenceForm,
			// badges
			gettingBadges,
			badges,
		} = this.props

		// NavBar
		let navBarProps

		const titleColor = this.state.panY.interpolate({
			inputRange: [0, SCREEN_MARGIN],
			outputRange: ['white', ss.constants.COLOR_HEADING],
			extrapolate: 'clamp',
		})

		const iconOpacity = this.state.panY.interpolate({
			inputRange: [0, SCREEN_MARGIN],
			outputRange: [0, 1],
			extrapolate: 'clamp',
		})

		const iconWhiteOpacity = this.state.panY.interpolate({
			inputRange: [0, SCREEN_MARGIN],
			outputRange: [1, 0],
			extrapolate: 'clamp',
		})

		if (R.equals('user', profileType)) {
			navBarProps = { onRight: () => openDrawer() }
		} else {
			navBarProps = { onLeft: () => {
				this.state.panY.removeAllListeners()
				NavigationActions.pop()
			} }
		}
		// End of NavBar

		// Cards
		let mediaProps = {
			onVideoPress: navigateToProfileVideo,
			onPhotoPress: navigateToProfilePhoto,
		}
		let experienceProps
		let educationProps
		let referencesProps

		if (R.equals('user', profileType)) {
			mediaProps = {
				...mediaProps,
				canAddPhoto: true,
				onAddPhoto: () => navigateToProfilePhotoForm(),
				canAddVideo: true,
				onAddVideo: () => navigateToProfileVideoForm(),
			}

			experienceProps = {
				canAdd: true,
				onAdd: () => navigateToProfileAddBio('Add Experience', 'experience'),
			}

			educationProps = {
				canAdd: true,
				onAdd: () => navigateToProfileAddBio('Add Education', 'education'),
			}
		} else {
			referencesProps = {
				canAdd: true,
				onAdd: () => navigateToProfileReferenceForm(),
			}
		}
		// End of Cards

		if (profile) {
			if (!R.equals('user', profileType)) {
				navBarProps = {
					...navBarProps,
					title: `${profile.first_name}'s Profile`,
				}
			}
		}

		return (
			<View style={styles.wrapper}>
				<ProfileNavBar
					title={R.equals('user', profileType) ? 'My Profile' : 'Profile'}
					titleStyle={{ color: titleColor }}
					iconStyle={{ opacity: iconOpacity }}
					iconWhiteStyle={{ opacity: iconWhiteOpacity }}
					{...navBarProps}
				/>
				{profile && (
					<ProfileCardView
						width={SWIPER_WIDTH}
						height={SWIPER_HEIGHT}
					>
						{R.equals('user', profileType) && (
							<ProfileCardMedia
								gettingPhotos={gettingPhotos}
								photos={photos}
								gettingVideos={gettingVideos}
								videos={videos}
								onShowAllPhotos={() => navigateToProfilePhotos()}
								onShowAllVideos={() => navigateToProfileVideos()}
								{...mediaProps}
							/>
						)}
						<ProfileCardExperience
							gettingBio={gettingBio}
							experience={experience}
							onShowAll={() => navigateToProfileExperience()}
							{...experienceProps}
						/>
						<ProfileCardEducation
							gettingBio={gettingBio}
							education={education}
							onShowAll={() => navigateToProfileEducation()}
							{...educationProps}
						/>
						<ProfileCardReferences
							gettingReferences={gettingReferences}
							references={references}
							onShowAll={() => navigateToProfileReferences()}
							{...referencesProps}
						/>
						<ProfileCardBadges
							gettingBadges={gettingBadges}
							badges={badges}
						/>
					</ProfileCardView>
				)}
				<Animated.View
					style={[styles.overlay, { transform: [{ translateY: this.state.panY }] }]}
					{...this.panResponder.panHandlers}
				>
					<ShowreelBackground cloudinaryPublicId={profile && profile.cloudinary_file_id} />
					{this.renderOverlay()}
				</Animated.View>
			</View>
		)
	}

}

ProfileScreen.propTypes = {
	profileType: PropTypes.oneOf(['user', 'friend']).isRequired,
	memberId: PropTypes.number.isRequired,
}


// StyleSheet
const {
	size,
	base: { wrapper },
	typo: { h1, pLight },
} = ss

const styles = ss.create({
	wrapper: {
		...wrapper,
		backgroundColor: '#F4F3F5',
		// backgroundColor: 'gray', // NOTE testing flexbox
	},
	// Showreel
	overlay: {
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		backgroundColor: 'rgba(0, 0, 0, .8)',
		android: {
			zIndex: 1,
		},
	},
	showreel: {
		// backgroundColor: 'pink', // NOTE testing flexbox
		zIndex: 1,
		flex: 1,
		paddingTop: ss.constants.HEIGHT_NAV_BAR,
		paddingBottom: size(30),
	},
	showreelTopBar: {
		// backgroundColor: 'rgba(0, 0, 0, .95)', // NOTE testing flexbox
		position: 'absolute',
		left: 0,
		right: 0,
		height: SCREEN_MARGIN,
	},
	showreelTopBarContainer: {
		// backgroundColor: 'pink', // NOTE testing flexbox
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: size(30),
	},
	showreelTopBarTitle: {
		...pLight,
		fontSize: size(18),
		color: 'white',
	},
	showreelPull: {
		alignItems: 'center',
	},
	showreelHeader: {
		// backgroundColor: 'rgba(255, 255, 255, 0.2)', // NOTE testing flexbox
		padding: size(20),
	},
	showreelTitle: {
		...h1,
		fontSize: size(36),
		color: 'white',
		textAlign: 'center',
		marginBottom: size(20),
	},
	showreelSubtitle: {
		...pLight,
		fontSize: size(18),
		color: 'white',
		textAlign: 'center',
	},
	showreelContent: {
		// backgroundColor: 'rgba(255, 255, 255, 0.3)', // NOTE testing flexbox
		flex: 1,
		justifyContent: 'flex-end',
		paddingHorizontal: size(20),
	},
	showreelEdit: {
		alignItems: 'center',
		paddingTop: size(30),
	},
	androidNavBar: {
		position: 'absolute',
		top: 0,
		right: 0,
		height: ss.constants.HEIGHT_NAV_BAR,
		left: 0,
	},
})


// Redux mappings
const mapStateToProps = state => ({
	user: state.user,
	profile: R.omit(['connectionProfile', 'errorCode'], state.profile),
	connectionProfile: R.omit(['errorCode'], state.profile.connectionProfile),
})

function mergeProps(stateProps, dispatchProps, ownProps) {
	const { dispatch } = dispatchProps

	let isUser = false
	let memberId = ownProps.memberId
	let profile = stateProps.connectionProfile

	// NOTE is current user profile?
	if (R.equals('user', ownProps.profileType)) {
		isUser = true
		memberId = stateProps.user.data && stateProps.user.data.member_id
		profile = {
			gettingProfile: stateProps.user.gettingUser,
			data: stateProps.user.data,
			currentQualification: stateProps.user.currentQualification,
			...stateProps.profile,
		}
	}

	return {
		...ownProps,
		showreelOpen: profile.showreelOpen,
		gettingProfile: profile.gettingProfile,
		profile: profile.data,
		currentQualification: profile.currentQualification,
		// media
		gettingPhotos: profile.gettingPhotos,
		photos: profile.photos && R.take(9, profile.photos),
		gettingVideos: profile.gettingVideos,
		videos: profile.videos && R.take(3, profile.videos),
		// experience & education (bio)
		gettingBio: profile.gettingBio,
		experience: profile.experience && R.take(3, profile.experience),
		education: profile.education && R.take(3, profile.education),
		// references
		gettingReferences: profile.gettingReferences,
		references: profile.receivedReferences && R.take(3, profile.receivedReferences),
		// badges
		gettingBadges: false,
		// TODO badges hardcoded for now
		badges: [
			{
				badge: ss.images.profileBadge,
				title: 'Well done!',
				description: 'You have created a profile',
				date: (profile.data && profile.data.join_date) || '2017-04-01',
			},
		],
		openDrawer: () => dispatch(CoreActions.toggleDrawer(true)),
		toggleShowreel: (open) => {
			if (isUser) {
				dispatch(ProfileActions.toggleUserProfileShowreel(open))
			} else {
				dispatch(ProfileActions.toggleConnectionProfileShowreel(open))
			}
		},
		// Profile
		getProfile: () => {
			if (!isUser) {
				dispatch(ProfileActions.getConnectionProfileAttempt(memberId))
			}
		},
		unsetConnectionProfile: () => dispatch(ProfileActions.unsetConnectionProfile()),
		navigateToSettingsPersonalInfo: () => {
			NavigationActions.SettingsPersonalInfo({
				direction: 'vertical',
				panHandlers: null,
				// backButtonImage: ss.images.iconNavClose,
				renderBackButton: () => (
					<NavBarIconButton name="back"
						onPress={() => NavigationActions.pop()}
					/>
				),
			})
		},
		// Media
		getProfilePhotos: () => {
			if (isUser) {
				dispatch(ProfileActions.getUserProfilePhotosAttempt(memberId))
			} else {
				dispatch(ProfileActions.getConnectionProfilePhotosAttempt(memberId))
			}
		},
		getProfileVideos: () => {
			if (isUser) {
				dispatch(ProfileActions.getUserProfileVideosAttempt(memberId))
			} else {
				dispatch(ProfileActions.getConnectionProfileVideosAttempt(memberId))
			}
		},
		navigateToProfilePhotos: props => NavigationActions.ProfilePhotos({
			profileType: ownProps.profileType,
			...props,
		}),
		navigateToProfilePhoto: ({ media_id }) => NavigationActions.ProfilePhoto({
			profileType: ownProps.profileType,
			mediaId: media_id,
		}),
		navigateToProfilePhotoForm: () => NavigationActions.ProfilePhotoForm(),
		navigateToProfileVideos: props => NavigationActions.ProfileVideos({
			profileType: ownProps.profileType,
			...props,
		}),
		navigateToProfileVideo: ({ media_id }) => NavigationActions.ProfileVideo({
			profileType: ownProps.profileType,
			mediaId: media_id,
		}),
		navigateToProfileVideoForm: () => NavigationActions.ProfileVideoForm(),
		// Bio
		getProfileBio: () => {
			if (isUser) {
				dispatch(ProfileActions.getUserProfileBioAttempt(memberId))
			} else {
				dispatch(ProfileActions.getConnectionProfileBioAttempt(memberId))
			}
		},
		navigateToProfileExperience: props => NavigationActions.ProfileExperience({
			profileType: ownProps.profileType,
			...props,
		}),
		navigateToProfileEducation: props => NavigationActions.ProfileEducation({
			profileType: ownProps.profileType,
			...props,
		}),
		navigateToProfileAddBio: (title, type) => {
			NavigationActions.ProfileBioForm({
				title,
				direction: 'vertical',
				panHandlers: null,
				// backButtonImage: ss.images.iconNavClose,
				renderBackButton: () => (
					<NavBarIconButton name="back"
						onPress={() => NavigationActions.pop()}
					/>
				),
				initialValues: {
					member_bio_id: null,
					type,
					cloudinary_file_id: null,
					title: '',
					subtitle: '',
					description: '',
					from_date: '',
					to_date: '',
					location: '',
				},
			})
		},
		// References
		getProfileReferences: () => {
			if (isUser) {
				dispatch(ProfileActions.getUserProfileReferencesAttempt(memberId))
			} else {
				dispatch(ProfileActions.getConnectionProfileReferencesAttempt(memberId))
			}
		},
		navigateToProfileReferences: props => NavigationActions.ProfileReferences({
			profileType: ownProps.profileType,
			...props,
		}),
		navigateToProfileReferenceForm: () => NavigationActions.ProfileReferenceForm(),
	}
}


export default connect(mapStateToProps, null, mergeProps)(ProfileScreen)
