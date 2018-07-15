import React, { PropTypes } from 'react'
import {
	ViewPropTypes,
} from 'react-native'

import { createIconSetFromIcoMoon } from 'react-native-vector-icons'

import icoMoonConfig from '../../../assets/fonts/selection'

import ss from '../../../styles'

const VectorIcon = createIconSetFromIcoMoon(icoMoonConfig)

const Icon = ({
	name,
	color,
	size,
	style,
}) => (
	<VectorIcon
		name={name}
		color={color}
		size={size}
		style={[styles.icon, style]}
	/>
)

// StyleSheet
const styles = ss.create({
	icon: {
		backgroundColor: 'transparent',
	},
})

Icon.propTypes = {
	name: PropTypes.string.isRequired,
	color: PropTypes.string,
	size: PropTypes.number,
	style: ViewPropTypes.style,
}

Icon.defaultProps = {
	color: ss.constants.COLOR_CORE_PRIMARY,
	size: ss.size(20),
	style: {},
}

export default Icon
