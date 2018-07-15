import PropTypes from 'prop-types'
import React from 'react'
import {
	TouchableOpacity,
	Animated,
} from 'react-native'

import ss from '../../../styles'
import Icon from '../core/icon'

const NavBarIconButton = ({
	style,
	name,
	color,
	size,
	onPress,
}) => {
	let iconSize

	switch (name) {
	case 'search':
		iconSize = ss.size(18)
		break
	case 'cancel':
		iconSize = ss.size(12)
		break
	case 'close':
		iconSize = ss.size(12)
		break
	case 'settings':
		iconSize = ss.size(17)
		break
	default:
		iconSize = size
	}

	return (
		<Animated.View style={style}>
			<TouchableOpacity
				onPress={onPress}
				// onPress={() => InteractionManager.runAfterInteractions(onPress)}
			>
				<Icon name={name} color={color} size={iconSize} style={styles.navButtonIcon} />
			</TouchableOpacity>
		</Animated.View>
	)
}


NavBarIconButton.propTypes = {
	style: Animated.View.propTypes.style,
	color: PropTypes.string,
	name: PropTypes.string,
	size: PropTypes.number,
	onPress: PropTypes.func.isRequired,
}

NavBarIconButton.defaultProps = {
	name: null,
	color: ss.constants.COLOR_CORE_PRIMARY,
	image: null, // TODO Delete
	size: ss.size(14),
	style: {},

}


// StyleSheet
const {
	navBar: { navButtonIcon, navButtonImage },
} = ss

const styles = ss.create({
	navButtonIcon: {
		...navButtonIcon,
	},
	navButtonImage: {
		...navButtonImage,
	},
})

export default NavBarIconButton
