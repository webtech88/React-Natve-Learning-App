import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
	View,
	TouchableOpacity,
	Animated,
	Image,
} from 'react-native'

import ss from '../../../styles'
import Icon from './icon'
import CloudinaryImage from './cloudinary-image'
import TransText from './transtext'
import ProgressBadge from '../workbook/progress-badge'

const HEIGHT_TRANSLATE_Y = 100


class CommunityListItem extends Component {

	state = {
		animTranslateY: new Animated.Value(this.props.animated ? HEIGHT_TRANSLATE_Y : 0),
		selected: false, // TODO: Delete
	}

	componentDidMount() {
		if (this.props.animated) {
			this.animate(this.props.animatedDelay)
		}
	}

	componentWillReceiveProps(newProps) {
		if (newProps.animated) {
			// this.state.animTranslateY.stopAnimation()
			this.animate(newProps.animatedDelay)
		}
	}

	componentWillUnmount() {
		this.state.animTranslateY.stopAnimation()
	}

	animate = (delay) => {
		// TODO really want that spring to work here

		Animated.sequence([
			Animated.delay(delay),
			// Animated.spring(this.state.animTranslateY, {
			// 	toValue: 0,
			// 	friction: 10
			// })
			Animated.timing(this.state.animTranslateY, {
				toValue: 0,
				duration: 300,
			}),
		]).start((animated) => {
			if (animated.finished) {
				this.setState({ animTranslateY: new Animated.Value(HEIGHT_TRANSLATE_Y) })
			}
		})
	}

	toggleSelected = () => { // TODO: Delete when functionality available
		const { selected } = this.state
		this.setState({ selected: !selected })
	}

	render() {
		const { connection, onPress, onContactSelect, showProgressBar } = this.props
		const {
			cloudinary_file_id,
			screen_name,
			gender,
			online,
			current_qualification: {
				short_title: qualificationTitle,
				progress_percentage: progressPercentage
			},
			// last_login: { platform, browser },
		} = connection
		const photoDimensions = size(50)
		const last_login = []
		// if (platform) last_login.push(platform)
		// if (browser) last_login.push(browser)

		return (
			<Animated.View style={[styles.listItem, { transform: [{ translateY: this.state.animTranslateY }] }]}>
				{onContactSelect &&
					<TouchableOpacity
						activeOpacity={0.85}
						style={styles.touchableRight}
						onPress={() => {
							this.toggleSelected()
							onContactSelect(connection)
						}}
					>
						{<Image source={this.state.selected ? ss.images.iconTickTicked : ss.images.iconTickUnticked} />}
						{/* <Icon
							name={this.state.selected ? 'tick-ticked' : 'tick-unticked'}
							size={size(20)}
						/> */}
					</TouchableOpacity>
				}
				<TouchableOpacity
					activeOpacity={0.85}
					style={styles.touchableLeft}
					onPress={() => onPress(connection)}
				>
					{
						showProgressBar ?
						(
							<ProgressBadge
								style={{ marginRight: size(15) }}
								dimensions={size(70)}
								percentage={progressPercentage || 0}
								animated
								shadow={false}
							>
								<CloudinaryImage
									style={{
										backgroundColor: ss.constants.COLOR_CORE_SECONDARY,
									}}
									publicId={cloudinary_file_id}
									placeholder={gender === 2 ? 'avatar-female' : 'avatar-male'}
									placeholderSize={size(25)}
									width={photoDimensions}
									height={photoDimensions}
									borderRadius={photoDimensions}
									options="profile"
								/>
							</ProgressBadge>
						) :
						(
							<CloudinaryImage
								style={{
									marginRight: size(10),
									backgroundColor: ss.constants.COLOR_CORE_SECONDARY,
								}}
								publicId={cloudinary_file_id}
								placeholder={gender === 2 ? 'avatar-female' : 'avatar-male'}
								placeholderSize={size(25)}
								width={photoDimensions}
								height={photoDimensions}
								borderRadius={photoDimensions}
								options="profile"
							/>
						)
					}
					<View style={styles.infoContainer}>
						<View style={styles.topRow}>
							<TransText numberOfLines={2} style={styles.name} transkey={screen_name || 'Unknown User'} />
							{online
								? <View style={styles.onlineContainer}>
									<View numberOfLines={1} style={styles.onlineIcon} />
									<TransText numberOfLines={1} style={styles.online} transkey="online" />
								</View>
								: null
							}
						</View>
						<View>
							{qualificationTitle &&
								<TransText style={styles.qualification} transkey={qualificationTitle} />
							}
							{last_login && last_login.length > 0 &&
								<TransText style={styles.platform} transkey={last_login.join(', ')} />
							}
						</View>
					</View>
				</TouchableOpacity>
			</Animated.View>
		)
	}
}

CommunityListItem.propTypes = {
	connection: PropTypes.shape({
		cloudinary_file_id: PropTypes.string,
		screen_name: PropTypes.string,
		gender: PropTypes.number,
		online: PropTypes.number,
		current_qualification: PropTypes.object,
		last_login: PropTypes.object,
	}).isRequired,
	onPress: PropTypes.func.isRequired,
	onContactSelect: PropTypes.func,
	inGroup: PropTypes.bool,
	animated: PropTypes.bool.isRequired,
	animatedDelay: PropTypes.number.isRequired,
	showProgressBar: PropTypes.bool,
}

CommunityListItem.defaultProps = {
	animated: false,
	animatedDelay: 0,
	onContactSelect: null,
	inGroup: false,
	showProgressBar: false,
}


// StyleSheet
const {
	size,
	typo: { p },
} = ss

const styles = ss.create({
	listItem: {
		flex: 1,
		flexDirection: 'row',
		backgroundColor: 'white',
		padding: size(15),
		borderBottomWidth: 1,
		borderBottomColor: 'rgba(0, 0, 0, 0.1)',
	},
	touchableLeft: {
		flex: 1,
		flexDirection: 'row',
	},
	infoContainer: {
		flex: 1,
	},
	topRow: {
		alignItems: 'flex-start',
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		// marginBottom: size(5),
	},
	name: {
		...p,
		flex: 4,
		fontSize: size(14),
	},
	onlineContainer: {
		flex: 1,
		alignItems: 'center',
		flexDirection: 'row',
		paddingLeft: size(10),
	},
	onlineIcon: {
		backgroundColor: ss.constants.COLOR_ACCENT_GREEN,
		borderRadius: size(8),
		marginTop: size(2),
		marginRight: size(5),
		height: size(8),
		width: size(8),
	},
	online: {
		...p,
		fontSize: size(12),
		color: ss.constants.COLOR_ACCENT_GREEN,
	},
	qualification: {
		...p,
		fontSize: size(12),
		opacity: 0.8,
		marginBottom: size(5),
	},
	platform: {
		...p,
		fontSize: size(10),
		opacity: 0.6,
	},
	touchableRight: {
		justifyContent: 'center',
		paddingRight: size(10),
	},
})

export default CommunityListItem
