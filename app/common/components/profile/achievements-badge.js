import PropTypes from 'prop-types'
import React from 'react'
import {
	View,
	ViewPropTypes,
	Image,
} from 'react-native'

import Svg, { Polygon } from 'react-native-svg'

import Icon from '../core/icon'

import ss from '../../../styles'

const AchievementsBadge = ({
	badge,
	height,
	width,
	style,
}) => {
	const hexPoint1 = `${width / 2},1` // top and middle, y-coordinate adjusted by 1 to show border
	const hexPoint2 = `${width - 1},${height / 4}` // upper right
	const hexPoint3 = `${width - 1},${(3 * height) / 4}` // lower right
	const hexPoint4 = `${width / 2},${height - 1}` // bottom and middle
	const hexPoint5 = `1,${(3 * height) / 4}` // lower left
	const hexPoint6 = `1,${height / 4}` // upper left

	return (
		<View style={style}>
			<Svg height={height} width={width}>
				<Polygon
					points={`${hexPoint1} ${hexPoint2} ${hexPoint3} ${hexPoint4} ${hexPoint5} ${hexPoint6}`}
					fill={ss.constants.COLOR_CORE_SECONDARY}
					stroke={ss.constants.COLOR_CORE_BRAND}
					strokeWidth="2"
				/>
			</Svg>
			<View style={[{ width, height }, style, styles.imageContainer]}>
				{badge
					? <Image source={badge} style={{ height: 0.5 * height }} resizeMode="contain" />
					: <Icon name="badges" size={ss.size(26)} />
				}

			</View>
		</View>
	)
}

AchievementsBadge.propTypes = {
	badge: Image.propTypes.source,
	style: ViewPropTypes.style,
	height: PropTypes.number.isRequired,
	width: PropTypes.number.isRequired,
}

AchievementsBadge.defaultProps = {
	badge: null,
	style: {},
	height: ss.size(60),
	width: ss.size(50),
}

// StyleSheet
const styles = ss.create({
	imageContainer: {
		position: 'absolute',
		alignItems: 'center',
		justifyContent: 'center',
	},
})

export default AchievementsBadge
