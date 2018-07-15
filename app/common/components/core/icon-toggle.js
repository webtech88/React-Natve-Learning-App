import PropTypes from 'prop-types'
import React from 'react'
import {
	View,
	ViewPropTypes,
} from 'react-native'

import ss from '../../../styles'
import Icon from './icon'

const IconToggle = ({
    style,
	iconStyle,
	expanded,
}) => {
	const icon = expanded ? 'collapse' : 'expand'

	return (
		<View style={[styles.container, style]}>
			<Icon name={icon}
				color={iconStyle === 'light'
					? ss.constants.COLOR_CORE_LIGHT
					: ss.constants.COLOR_CORE_PRIMARY
				}
				size={ss.size(24)}
			/>
		</View>
	)
}

IconToggle.propTypes = {
	style: ViewPropTypes.style,
	iconStyle: PropTypes.oneOf(['light', 'dark']).isRequired,
	expanded: PropTypes.bool,
}

IconToggle.defaultProps = {
	style: {},
	iconStyle: 'dark',
	expanded: false,
}

// StyleSheet
const {
	size,
} = ss

const styles = {
	container: {
		width: size(12),
		height: size(24),
	},
	icon: {
		width: size(12),
		height: size(24),
		backgroundColor: 'transparent',
	},
}

export default IconToggle
