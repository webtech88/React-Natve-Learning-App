import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
	View,
	Animated,
	ScrollView,
	Platform,
} from 'react-native'

import cloudinary from 'cloudinary-core'
import Config from 'react-native-config'
import AddPaging from 'react-native-paged-scroll-view/index'

import cloudinaryConfiguration from '../../core/config/cloudinary'

import QualificationVideo from './qualification-video'
import QualificationCard from './qualification-card'

import ss from '../../styles'

const HEIGHT = ss.constants.HEIGHT_DEVICE - ss.constants.HEIGHT_NAV_BAR
const HEIGHT_HALF = HEIGHT / 2

const ANIM_OPACITY_START = 0.25
const ANIM_TRANSLATE_Y_START = HEIGHT_HALF
const SWIPER_WIDTH = ss.constants.WIDTH_DEVICE

const PagedScrollView = AddPaging(ScrollView)

class Qualifications extends Component {

	constructor(props) {
		super(props)

		this.state = {
			animOpacity: new Animated.Value(ANIM_OPACITY_START),
			animTranslateY: new Animated.Value(ANIM_TRANSLATE_Y_START),
		}

		this.cl = cloudinary.Cloudinary.new({ cloud_name: Config.CLOUDINARY_CLOUD_NAME })
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
				this.animateOut()
			}
		}
	}

	animateIn = () => {
		const parallel = Animated.parallel
		const spring = Animated.spring

		parallel([
			spring(this.state.animTranslateY, {
				toValue: 0,
				friction: 10,
				useNativeDriver: true,
			}),
			spring(this.state.animOpacity, {
				toValue: 1,
				friction: 8,
				useNativeDriver: true,
			}),
		]).start()
	}

	animateOut = (callback) => {
		const parallel = Animated.parallel
		const timing = Animated.timing

		parallel([
			timing(this.state.animTranslateY, {
				toValue: ANIM_TRANSLATE_Y_START,
				duration: 200,
				useNativeDriver: true,
			}),
			timing(this.state.animOpacity, {
				toValue: ANIM_OPACITY_START,
				duration: 200,
				useNativeDriver: true,
			}),
		]).start(animated => animated.finished && callback && callback())
	}

	handlePress = (qualificationId) => {
		this.animateOut(() => this.props.onPress(qualificationId))
	}

	handlePageChange = (paginationData: Object) => {
		const { setCurrentQualifiactionId, qualifications } = this.props

		setCurrentQualifiactionId(Number(Object.keys(qualifications)[paginationData.currentHorizontalPage - 1]))
	}

	render() {
		const {
			playVideo,
			qualifications,
			currentQualificationId,
		} = this.props
		const videoSource = this.cl.url(
			qualifications[currentQualificationId].video,
			{ ...cloudinaryConfiguration.video },
		)

		return (
			<View style={{ flex: 1, backgroundColor: ss.constants.COLOR_CORE_PRIMARY }}>
				{videoSource && (
					<QualificationVideo
						key={Platform.OS === 'android' ? videoSource : 'qualificationVideo'}
						source={videoSource}
						play={playVideo}
					/>
				)}
				<PagedScrollView
					ref={(c) => { this.list = c }}
					horizontal
					pagingEnabled
					showsHorizontalScrollIndicator={false}
					onPageChange={this.handlePageChange}
					style={styles.container}
				>
					{Object.keys(qualifications).map(key => (
						<Animated.View
							key={key}
							style={[{
								flex: 1,
								opacity: this.state.animOpacity,
								transform: [{ translateY: this.state.animTranslateY }],
							},
								styles.contentContainer,
							]}
						>
							<QualificationCard
								key={`QualificationCard_${qualifications[key].qualification_id}`}
								qualification={qualifications[key]}
								onPress={() => this.handlePress(qualifications[key].qualification_id)}
							/>
						</Animated.View>
				))}
				</PagedScrollView>
			</View>
		)
	}
}

Qualifications.propTypes = {
	visible: PropTypes.bool,
	playVideo: PropTypes.bool.isRequired,
	qualifications: PropTypes.object.isRequired,
	currentQualificationId: PropTypes.number.isRequired,
	setCurrentQualifiactionId: PropTypes.func.isRequired,
	// activeQualificationId: PropTypes.number,
	onPress: PropTypes.func.isRequired,
}

Qualifications.defaultProps = {
	visible: false,
	// activeQualificationId: null,
}

// StyleSheet
const styles = ss.create({
	container: {
		flex: 1,
	},
	contentContainer: {
		width: SWIPER_WIDTH,
		flex: 1,
	},
})

export default Qualifications
