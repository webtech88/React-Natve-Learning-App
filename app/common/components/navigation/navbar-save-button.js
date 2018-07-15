import PropTypes from 'prop-types'
import React from 'react'
import {
	ActivityIndicator,
	View,
	TouchableOpacity,
} from 'react-native'

import ss from '../../../styles'
import TransText from '../core/transtext'

const {
	navBar: { navButtonText },
	size,
} = ss

const renderText = text => <TransText style={styles.text} transkey={text} />

const renderLoading = () =>
	(<ActivityIndicator
		color={ss.constants.COLOR_CORE_PRIMARY}
		size="small"
	/>)

const NavBarSaveButton = ({
	active,
	attempting,
	onPress,
	text,
}) => {
	const NavBarButton = !attempting && active ? TouchableOpacity : View
	const buttonStyle = !attempting && !active && { opacity: 0.3 }

	return (
		<NavBarButton
			style={[styles.button, buttonStyle]}
			onPress={onPress}
		>
			{attempting ? renderLoading() : renderText(text)}
		</NavBarButton>
	)
}


NavBarSaveButton.propTypes = {
	active: PropTypes.bool.isRequired,
	attempting: PropTypes.bool.isRequired,
	onPress: PropTypes.func.isRequired,
	text: PropTypes.string,
}

NavBarSaveButton.defaultProps = {
	text: 'Save',
}

// StyleSheet

const styles = ss.create({
	button: {
		padding: 0,
		android: {
			paddingTop: size(5),
		},
	},
	text: {
		...navButtonText,
	},
})

export default NavBarSaveButton
