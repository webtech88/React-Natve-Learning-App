import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
	View,
	ViewPropTypes,
} from 'react-native'

import ss from '../../../styles'

class NavBarButtons extends Component {

	render() {
		const { position, children, navBarButtonStyle } = this.props

		if (children) {
			const style = (position === 'right') ? styles.navButtonRight : styles.navButtonLeft

			return (
				<View style={[styles.navButton, style, navBarButtonStyle]}>
					{children}
				</View>
			)
		}

		return null
	}

}


NavBarButtons.propTypes = {
	position: PropTypes.oneOf(['left', 'right']).isRequired,
	navBarButtonStyle: ViewPropTypes.style,
}

NavBarButtons.defaultProps = {
	navBarButtonStyle: {},
}

// StyleSheet
const {
	navBar: { navButton, navButtonLeft, navButtonRight },
} = ss

const styles = ss.create({
	navButton: {
		...navButton,
	},
	navButtonLeft: {
		...navButtonLeft,
	},
	navButtonRight: {
		...navButtonRight,
	},
})

export default NavBarButtons
