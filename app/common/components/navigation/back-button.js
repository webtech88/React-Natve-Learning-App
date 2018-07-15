import PropTypes from 'prop-types'
import React from 'react'
import {
	View,
	ViewPropTypes,
	TouchableOpacity,
} from 'react-native'

import Icon from '../core/icon'
import ss from '../../../styles'

const BackButton = ({
	style,
	name,
	onPress,
}) => {
	let icon
	switch (name) {
	case 'hide':
		icon = 'hide'
		break
	case 'close':
		icon = 'cancel'
		break
	case 'cancel':
		icon = 'cancel'
		break
	default:
		icon = 'back'
	}

	return (
		<View style={[styles.container, style]}>
			<TouchableOpacity
				style={styles.button}
				activeOpacity={0.9}
				onPress={onPress}
			>
				{icon && <Icon name={icon} size={ss.size(10)} style={icon === 'hide' && { paddingTop: 2 }} />}
			</TouchableOpacity>
		</View>
	)
}

BackButton.propTypes = {
	style: ViewPropTypes.style,
	name: PropTypes.oneOf(['back', 'hide', 'close', 'cancel']),
	onPress: PropTypes.func.isRequired,
}

BackButton.defaultProps = {
	style: {},
	name: 'back',
}

// StyleSheet
const {
	size,
	navBar: { navButtonIconCircle, navButtonIconCircleTouch },
} = ss

const styles = ss.create({
	container: {
		...navButtonIconCircle,
		position: 'absolute',
		zIndex: 2,
		top: size(10),
		left: size(10),
		// shadowOffset: {
		// 	height: 1,
		// },
		// shadowOpacity: 0.1,
	},
	button: {
		...navButtonIconCircleTouch,
	},
})

export default BackButton
