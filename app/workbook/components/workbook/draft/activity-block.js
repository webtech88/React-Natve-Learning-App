import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
	View,
	ViewPropTypes,
	Text,
	Image,
} from 'react-native'

import ss from '../../../../styles'
import common from '../../../../common'

const { Button } = common.components.core


class ActivityBlock extends Component {

	constructor(props) {
		super(props)

		this.state = {
			width: 0,
		}
	}

	renderRibbon = () => {
		const { data: { status } } = this.props

		if (status) {
			let ribbonBackground
			let ribbonColor
			let ribbonText

			switch (status) {
			case 'submitted':
				ribbonBackground = '#D4EAE4'
				ribbonColor = '#008638'
				ribbonText = 'SUBMITTED'
				break
			case 'approved':
				ribbonBackground = '#D2DB0E'
				ribbonColor = '#003057'
				ribbonText = 'APPROVED'
				break
			case 'rejected':
				ribbonBackground = '#DB0020'
				ribbonColor = '#FFFFFF'
				ribbonText = 'REJECTED'
				break
			default:
				ribbonBackground = '#D4EAE4'
				ribbonColor = '#008638'
				ribbonText = 'TO DO'
				break
			}

			return (
				<View style={styles.ribbon}>
					<View style={[styles.ribbonCont, { backgroundColor: ribbonBackground }]}>
						<Text style={[styles.ribbonText, { color: ribbonColor }]}>{ribbonText}</Text>
					</View>
				</View>
			)
		}

		return null
	}

	render() {
		const { width } = this.state
		const { style, data, onPress } = this.props

		const {
			activity_code,
			activity_id,
			covers_criteria,
			tout,
			tout_type,
			title,
			description,
		} = data

		if (activity_id && title) {
			let subtitle = []
			const activityTout = (
				<View style={styles.tout}>
					<Image
						style={{ flex: 1, width: null, height: null, backgroundColor: 'transparent' }}
						resizeMode="contain"
						source={ss.images.activityTout}
					/>
				</View>
			)

			if (activity_code) {
				subtitle.push(`Activity ${activity_code}`)
			}

			if (covers_criteria && covers_criteria.length > 0) {
				subtitle.push(`Covering outcome criteria ${covers_criteria.join(', ')}`)
			}

			if (subtitle && subtitle.length > 0) subtitle = subtitle.join(' - ')

			// TODO when api ready
			// if (tout && tout_type && (width > 0)) {
			// 	switch (tout_type) {
			// 	case 'image':
			// 		activityTout = (
			// 			<View style={styles.image}>
			// 				<CloudinaryImage
			// 					publicId={tout}
			// 					width={size(250)}
			// 					height={size(160)}
			// 					options="contain"
			// 				/>
			// 			</View>
			// 		)
			// 		break
			// 	case 'video':
			// 		activityTout = (
			// 			<View style={styles.video}>
			// 				<CloudinaryImage
			// 					style={styles.poster}
			// 					publicId={tout}
			// 					width={width}
			// 					height={size(160)}
			// 					isLoading={false}
			// 					options="poster"
			// 				/>
			// 			</View>
			// 		)
			// 		break
			// }

			return (
				<View style={style} onLayout={e => this.setState({ width: e.nativeEvent.layout.width })}>
					<View style={styles.block}>
						{activityTout}
						<View style={styles.info}>
							{title ? <Text style={styles.h1}>{title}</Text> : null}
							{(subtitle && subtitle.length > 0) ? <Text style={styles.p}>{subtitle}</Text> : null}
							{description ? <Text style={styles.p}>{description}</Text> : null}
							<View style={{ width: size(140), marginTop: size(10) }}>
								<Button
									label="Open Activity"
									color={ss.constants.COLOR_CORE_QUATERNARY}
									labelColor={ss.constants.COLOR_CORE_PRIMARY}
									onPress={onPress}
								/>
							</View>
						</View>
						{this.renderRibbon()}
					</View>
				</View>
			)
		}

		return null
	}

}

ActivityBlock.propTypes = {
	data: PropTypes.shape({
		tout: PropTypes.string,
		title: PropTypes.string,
		content: PropTypes.string,
		created: PropTypes.string,
		disabled: PropTypes.bool,
	}).isRequired,
	width: PropTypes.number,
	style: ViewPropTypes.style,
	onPress: PropTypes.func.isRequired,
}

ActivityBlock.defaultProps = {
	width: null,
	style: {},
}


// StyleSheet
const {
	size,
	typo: { h1, p, pSemiBold },
} = ss

const styles = ss.create({
	block: {
		backgroundColor: ss.constants.COLOR_CORE_BRAND,
		overflow: 'hidden',
		marginVertical: size(5),
	},
	tout: {
		marginTop: size(20),
		marginHorizontal: size(20),
		height: size(160),
	},
	image: {
		marginTop: size(20),
		marginHorizontal: size(20),
	},
	video: {
		height: size(160),
		backgroundColor: 'black',
	},
	poster: {
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
	},
	info: {
		padding: size(20),
	},
	h1: {
		...h1,
		fontSize: size(26),
		color: 'white',
		marginBottom: size(10),
	},
	p: {
		...p,
		fontSize: size(14),
		color: 'white',
		marginBottom: size(10),
	},
	ribbon: {
		zIndex: 1,
		position: 'absolute',
		top: -size(55),
		right: -size(55),
		width: size(200),
		height: size(200),
		justifyContent: 'center',
	},
	ribbonCont: {
		backgroundColor: 'white',
		height: size(40),
		transform: [{ rotate: '45deg' }],
		justifyContent: 'center',
		alignItems: 'center',
	},
	ribbonText: {
		...pSemiBold,
		fontSize: size(14),
	},
})


export default ActivityBlock
