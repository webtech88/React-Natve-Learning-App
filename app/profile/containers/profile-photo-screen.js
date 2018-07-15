// TODO: Better zoomable image needed. Info container should be animated.

import React, { Component } from 'react'
import {
	ScrollView,
	View,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	Animated,
	LayoutAnimation,
	Platform,
} from 'react-native'

import PropTypes from 'prop-types'

import R from 'ramda'
import { Actions as NavigationActions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import ProfileActions from '../actions/creator'

import ActionSheetButton from '../../core/components/action-sheet-button'
import ss from '../../styles'
import common from '../../common'

const { CloudinaryImage, Icon, Loading, NoResults } = common.components.core
const { MediaTag } = common.components.profile
const { BackButton } = common.components.navigation

const WIDTH = ss.constants.WIDTH_DEVICE
const HEIGHT = ss.constants.HEIGHT_DEVICE

const LayoutSpringAnim = {
	duration: 350,
	// duration: 2000,
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


class ProfilePhotoScreen extends Component {

	state = {
		animOpacity: new Animated.Value(0),
		showInfo: true,
		showDescription: false,
		lastPress: 0, // NOTE: for double tap  on image (toggleInfo function)
	}

	componentWillMount() {
		this.props.loadProfilePhoto(this.props.mediaId)
	}

	componentDidMount() {
		this.animateIn()
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.mediaId !== nextProps.mediaId) {
			this.props.loadProfilePhoto(nextProps.mediaId)
		}
	}

	componentWillUnmount() {
		this.props.unsetProfilePhoto()
	}

	scrolling = () => {
		// console.log('scrolling')
		const { showInfo, lastPress } = this.state
		// this.setState({zoomLevel: event.nativeEvent.zoomScale}) NOTE: Useful functionality later?

		if (showInfo && new Date().getTime() - lastPress >= 200) {
			// NOTE: Won't hide info on double tap (which resets image)
			this.setState({
				showInfo: false,
				showDescription: false,
			})
		}
	}

	toggleInfo = () => {
		// console.log('toggleInfo')
		const { showInfo, lastPress } = this.state
		const delta = new Date().getTime() - lastPress

		this.setState({
			showInfo: !showInfo,
			showDescription: false,
			lastPress: new Date().getTime(),
		})

		if (delta < 200) {
			this.refs.scrollZoom.scrollResponderZoomTo({
				width: WIDTH,
			})
			this.setState({
				showInfo: true,
			})
		}
	}

	toggleDescription = () => {
		// console.log('toggleDescription')
		LayoutAnimation.configureNext(LayoutSpringAnim)
		this.setState({ showDescription: !this.state.showDescription })
	}

	animateIn = () => {
		Animated.spring(this.state.animOpacity, {
			toValue: 1,
			friction: 12,
			useNativeDriver: true,
		}).start()
	}

	abbreviateCount = stat => stat < 1000
			? stat
			: (stat < 1000000
				? `${(stat / 1000).toFixed(1)} K`
				: `${(stat / 1000000).toFixed(1)} M`)

	renderPhotoStats = () => {
		const { profileType, photo, navigateToProfilePhotoForm } = this.props
		const {
			viewed,
			liked,
			downloaded,
			shared,
		} = photo

		return (
			<View>
				<View style={styles.stats}>
					<View style={[styles.statsItem, { opacity: 0.5 }]}>
						<Icon name="eye-open" size={ss.size(12)} />
						<Text style={styles.statsCount}>{this.abbreviateCount(viewed)}</Text>
					</View>
					<TouchableOpacity
						style={styles.statsItem}
						activeOpacity={0.7}
						onPress={() => null}
					>
						<Icon name="heart-outline" size={ss.size(26)} />
						<Text style={styles.statsCount}>{this.abbreviateCount(liked)}</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.statsItem}
						activeOpacity={0.7}
						onPress={() => null}
					>
						<Icon name="download" size={ss.size(26)} />
						<Text style={styles.statsCount}>{this.abbreviateCount(downloaded)}</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.statsItem}
						activeOpacity={0.7}
						onPress={() => null}
					>
						<Icon name="share" size={ss.size(26)} />
						<Text style={styles.statsCount}>{this.abbreviateCount(shared)}</Text>
					</TouchableOpacity>
					{R.equals('user', profileType) &&
						<View style={{ marginRight: -size(10) }}>
							<ActionSheetButton onPress={navigateToProfilePhotoForm} />
						</View>
					}
				</View>
			</View>
		)
	}

	renderTags = tags => (
		<View style={styles.tagContainer}>
			{tags.map((tag, index) => (
				<MediaTag
					key={`${tag}_${index}`}
					tag={tag}
				/>
			))}
		</View>
	)

	render() {
		const { showInfo, showDescription, zoomMaxScale } = this.state
		const {
			profileType,
			mediaId,
			loadingPhoto,
			photo,
			likeProfilePhoto,
			downloadProfilePhoto,
			shareProfilePhoto,
		} = this.props
		// let photoProps
		let contents = null

		// if (!R.equals('user', profileType)) {
		// 	photoProps = {
		// 		onLike: () => likeProfilePhoto(mediaId),
		// 		onDownload: () => downloadProfilePhoto(mediaId),
		// 		onShare: () => shareProfilePhoto(mediaId),
		// 	}
		// }

		if (loadingPhoto) {
			contents = <Loading message="Loading photo" />
		} else if (photo) {
			const { media_id, cloudinary_file_id, title, description, tags } = photo
			contents = (
				<View style={{ flex: 1 }}>
					<View style={{ flex: 1 }}>
						<ScrollView
							ref="scrollZoom"
							style={{ backgroundColor: 'black' }}
							contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}
							centerContent
							minimumZoomScale={1}
							maximumZoomScale={3}
							showsHorizontalScrollIndicator={false}
							showsVerticalScrollIndicator={false}
							scrollEventThrottle={16}
						>
							<TouchableWithoutFeedback onPress={this.toggleInfo}>
								<CloudinaryImage
									key={`ProfilePhotoImage_${media_id}`}
									publicId={cloudinary_file_id}
									width={WIDTH}
									height={HEIGHT}
									options="contain"
								/>
							</TouchableWithoutFeedback>
						</ScrollView>
					</View>
					{/* {showInfo && */}
					<View style={styles.info}>
						<ScrollView
							scrollEventThrottle={16}
							directionalLockEnabled
						>
							<TouchableOpacity
								style={{ padding: 20 }}
								activeOpacity={1}
								onPress={this.toggleDescription}
							>
								{title &&
									<Text style={styles.h2}>{title}</Text>
								}
								{description &&
									<Text style={styles.desc} numberOfLines={showDescription ? null : 1}>
										{description}
									</Text>
								}
								{tags && tags.length > 0 && this.renderTags(tags)}
							</TouchableOpacity>
						</ScrollView>
						<View style={styles.divider} />
						{this.renderPhotoStats()}
					</View>
				</View>
			)
		} else {
			contents = (
				<NoResults
					name="media"
					size={size(42)}
					message="Photo not found"
				/>
			)
		}

		return (
			<Animated.View style={[styles.wrapper, { opacity: this.state.animOpacity }]}>
				{contents}
				{Platform.OS === 'ios' &&
					<BackButton name="hide" onPress={NavigationActions.pop} />
			}
			</Animated.View>
		)
	}
}

ProfilePhotoScreen.propTypes = {
	profileType: PropTypes.oneOf(['user', 'friend']).isRequired,
	mediaId: PropTypes.number.isRequired,
	loadingPhoto: PropTypes.bool.isRequired,
	photo: PropTypes.object,
	loadProfilePhoto: PropTypes.func.isRequired,
	likeProfilePhoto: PropTypes.func.isRequired,
	downloadProfilePhoto: PropTypes.func.isRequired,
	shareProfilePhoto: PropTypes.func.isRequired,
	unsetProfilePhoto: PropTypes.func.isRequired,
	navigateToProfilePhotoForm: PropTypes.func.isRequired,
}

ProfilePhotoScreen.defaultProps = {
	photo: null,
}


// StyleSheet
const {
	size,
	base: { wrapper },
	typo: { h2, p },
	navBar: { navButtonIconCircle, navButtonIconCircleTouch, navButtonIcon },
} = ss

const styles = ss.create({
	wrapper: {
		...wrapper,
		paddingTop: 0,
		// height: HEIGHT,
	},
	info: {
		// position: 'absolute',
		// right: 0,
		// bottom: 0,
		// left: 0,
		// backgroundColor: 'white',
		maxHeight: HEIGHT / 2,
	},
	h2: {
		...h2,
		marginBottom: size(10),
	},
	desc: {
		...p,
		fontSize: size(14),
		color: ss.constants.COLOR_HEADING,
		opacity: 0.9,
	},
	divider: {
		height: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.1)',
	},

	// photo stats
	stats: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: size(20),
	},
	statsItem: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	statsIcon: {
		height: size(32),
	},
	statsCount: {
		...p,
		fontSize: size(12),
		color: ss.constants.COLOR_HEADING,
		marginLeft: size(10),
	},
	navButton: {
		position: 'absolute',
		top: 0,
		left: 0,
		padding: size(10),
	},
	navButtonIconCircle: {
		...navButtonIconCircle,
		shadowOffset: {
			height: 1,
		},
		elevation: 1,
	},
	navButtonIconCircleTouch: {
		...navButtonIconCircleTouch,
	},
	navButtonIcon: {
		...navButtonIcon,
	},
	tagContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		paddingVertical: size(10),
	},
})


// Redux mappings
const mapStateToProps = state => ({
	userId: state.user.data.member_id,
	loadingPhoto: state.profile.loadingPhoto,
	photo: state.profile.photo,
	loadingConnectionPhoto: state.profile.connectionProfile.loadingPhoto,
	connectionPhoto: state.profile.connectionProfile.photo,
})

function mergeProps(stateProps, dispatchProps, ownProps) {
	const { dispatch } = dispatchProps
	let userId
	let loadingPhoto = stateProps.loadingConnectionPhoto
	let photo = stateProps.connectionPhoto

	// NOTE is current user profile?
	if (R.equals('user', ownProps.profileType)) {
		userId = stateProps.userId
		loadingPhoto = stateProps.loadingPhoto
		photo = stateProps.photo
	}

	return {
		...ownProps,
		loadingPhoto,
		photo,
		loadProfilePhoto: (mediaId) => {
			if (userId) {
				dispatch(ProfileActions.loadUserProfilePhotoAttempt(mediaId))
			} else {
				dispatch(ProfileActions.loadConnectionProfilePhotoAttempt(mediaId))
			}
		},
		likeProfilePhoto: () => {
			console.log('TODO like photo')
		},
		downloadProfilePhoto: () => {
			console.log('TODO download photo')
		},
		shareProfilePhoto: () => {
			console.log('TODO share photo')
		},
		// reportProfilePhoto: () => null,
		unsetProfilePhoto: () => {
			if (userId) {
				dispatch(ProfileActions.unsetUserProfilePhoto())
			} else {
				dispatch(ProfileActions.unsetConnectionProfilePhoto())
			}
		},
		navigateToProfilePhotoForm: () => NavigationActions.ProfilePhotoForm(),
	}
}

export default connect(mapStateToProps, null, mergeProps)(ProfilePhotoScreen)
