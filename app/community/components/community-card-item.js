import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
	View,
	ViewPropTypes,
	TouchableOpacity,
	Animated,
} from 'react-native'

import ss from '../../styles'
import common from '../../common'

const { CloudinaryImage, TransText } = common.components.core


class CommunityCardItem extends Component {
	state = {
		animScale: new Animated.Value(this.props.animated ? 0.75 : 1),
	}

	componentDidMount() {
		if (this.props.animated) {
			this.animate(this.props.animatedDelay)
		}
	}

	componentWillReceiveProps(newProps) {
		if (newProps.animated) {
			// this.state.animScale.stopAnimation()
			this.animate(newProps.animatedDelay)
		}
	}

	componentWillUnmount() {
		this.state.animScale.stopAnimation()
	}

	animate = (delay) => {
		// TODO really want that spring to work here
		Animated.sequence([
			Animated.delay(delay),
			// Animated.spring(this.state.animScale, {
			// 	toValue: 1,
			// 	friction: 8
			// })
			Animated.timing(this.state.animScale, {
				toValue: 1,
				duration: 300,
			}),
		]).start((animated) => {
			if (animated.finished) {
				this.setState({ animScale: new Animated.Value(0.75) })
			}
		})
	}

	render() {
		const { style, width, height, connection, onPress } = this.props
		const {
			cloudinary_file_id,
			screen_name,
			gender,
			online,
			current_qualification: {
				short_title: qualificationTitle,
			},
			// last_login: { platform, browser },
		} = connection
		const last_login = []
		// if (platform) last_login.push(platform)
		// if (browser) last_login.push(browser)

		return (
			<TouchableOpacity
				activeOpacity={0.85}
				style={[styles.card, style, { width, height }]}
				onPress={() => onPress(connection)}
			>
				<Animated.View style={{ flex: 1, transform: [{ scale: this.state.animScale }] }}>
					<View style={styles.photo}>
						<CloudinaryImage
							style={{ backgroundColor: ss.constants.COLOR_CORE_SECONDARY }}
							publicId={cloudinary_file_id}
							placeholder={gender === 2 ? 'avatar-female' : 'avatar-male'}
							placeholderSize={size(50)}
							width={width}
							height={size(170)}
							options="profile"
						/>
					</View>
					<View style={styles.info}>
						<TransText numberOfLines={1} style={styles.name} transkey={screen_name || 'Unknown User'} />
						<View style={{ flex: 1 }}>
							{qualificationTitle &&
								<TransText numberOfLines={2} style={styles.qualification} transkey={qualificationTitle} />
							}
						</View>
						<View style={styles.footer}>
							{last_login && last_login.length > 0 &&
								<TransText numberOfLines={1} style={styles.platform} transkey={last_login.join(', ')} />
							}
							{online
								? <View style={styles.onlineContainer}>
									<View style={styles.onlineIcon} />
									<TransText style={styles.online} transkey="ONLINE" />
								</View>
								: null
							}
						</View>
					</View>
					<View style={styles.separator} />
				</Animated.View>
			</TouchableOpacity>
		)
	}
}

CommunityCardItem.propTypes = {
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	style: ViewPropTypes.style,
	connection: PropTypes.shape({
		cloudinary_file_id: PropTypes.string,
		screen_name: PropTypes.string,
		gender: PropTypes.number,
		online: PropTypes.number,
		current_qualification: PropTypes.object,
		last_login: PropTypes.object,
	}).isRequired,
	onPress: PropTypes.func.isRequired,
	animated: PropTypes.bool.isRequired,
	animatedDelay: PropTypes.number.isRequired,
}

CommunityCardItem.defaultProps = {
	animated: false,
	animatedDelay: 0,
	style: {},
}

// StyleSheet
const {
	size,
	typo: { p },
} = ss

const styles = ss.create({
	card: {
		position: 'relative',
	},
	photo: {
		flex: 7,
		backgroundColor: '#EEEEEE',
	},
	info: {
		flex: 3,
		backgroundColor: 'white',
		paddingTop: size(10),
		paddingBottom: size(10),
		paddingHorizontal: size(10),
		position: 'relative',
		justifyContent: 'space-between',
		borderBottomWidth: 1,
		borderBottomColor: 'rgba(0, 0, 0, 0.1)',
	},
	name: {
		...p,
		fontSize: size(14),
	},
	qualification: {
		...p,
		fontSize: size(11),
		opacity: 0.8,
	},
	footer: {
		paddingTop: size(5),
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	platform: {
		...p,
		fontSize: size(10),
		opacity: 0.6,
		overflow: 'hidden',
		flex: 3,
	},
	onlineContainer: {
		flex: 2,
		alignItems: 'center',
		flexDirection: 'row',
		marginLeft: size(5),
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
})

export default CommunityCardItem
