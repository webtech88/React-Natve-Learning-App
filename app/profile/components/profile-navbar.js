import PropTypes from 'prop-types'
import React from 'react'
import {
	View,
	Animated,
} from 'react-native'

import ss from '../../styles'
import common from '../../common'

const { size } = ss
const { NavBar, NavBarIconButton } = common.components.navigation


const ProfileNavBar = ({
	title,
	titleStyle,
	iconStyle,
	iconWhiteStyle,
	onRight,
	onLeft,
}) => {
	let navBarProps

	if (onRight) {
		// attach drawer button
		navBarProps = {
			renderRightButton: () => (
				<View style={styles.navBarIconContainer}>
					<NavBarIconButton
						key={'NavBarRightButton_1'}
						style={iconWhiteStyle}
						name="hamburger"
						color="white"
						onPress={onRight}
					/>
					<NavBarIconButton
						key={'NavBarRightButton_2'}
						style={{ marginLeft: -size(24), ...iconStyle }}
						name="hamburger"
						onPress={onRight}
					/>
				</View>
			),
		}
	} else if (onLeft) {
		// attach back button
		navBarProps = {
			renderLeftButton: () => (
				<View style={styles.navBarIconContainer}>
					<NavBarIconButton
						key={'NavBarLeftButton_1'}
						style={iconWhiteStyle}
						name="cancel"
						color="white"
						onPress={onLeft}
					/>
					<NavBarIconButton
						key={'NavBarLeftButton_2'}
						style={{ marginLeft: -size(10), ...iconStyle }}
						name="cancel"
						onPress={onLeft}
					/>
				</View>
			),
		}
	}

	return (
		<NavBar
			title={title}
			titleStyle={titleStyle}
			navigationBarStyle={{ backgroundColor: 'transparent', zIndex: 1 }}
			{...navBarProps}
		/>
	)
}

// StyleSheet
const {
	navBar: { navBarIconContainer },
} = ss

const styles = ss.create({
	navBarIconContainer: {
		...navBarIconContainer,
		android: {
			paddingTop: size(10),
		}
	},
})


ProfileNavBar.propTypes = {
	title: PropTypes.string.isRequired,
	titleStyle: Animated.Text.propTypes.style,
	iconStyle: Animated.View.propTypes.style,
	iconWhiteStyle: Animated.View.propTypes.style,
	onRight: PropTypes.func,
	onLeft: PropTypes.func,
}

ProfileNavBar.defaultProps = {
	titleStyle: {},
	iconStyle: {},
	iconWhiteStyle: {},
	onRight: null,
	onLeft: null,
}

export default ProfileNavBar
