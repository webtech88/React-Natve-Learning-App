import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
	View,
} from 'react-native'

import SegmentedControl from '../core/segmented-control'

import ss from '../../../styles'

class NavBarTitleSegmentedControl extends Component {

	render() {
		const { lightSegmentedControl, segments, selectedIndex, onPress } = this.props

		if (segments.length) {
			return (
				<View style={styles.navTitleWrapper}>
					<View style={styles.navTitle}>
						<SegmentedControl
							light={lightSegmentedControl}
							segments={segments}
							selectedIndex={selectedIndex}
							onPress={onPress}
						/>
					</View>
				</View>
			)
		}

		return null
	}

}


NavBarTitleSegmentedControl.propTypes = {
	lightSegmentedControl: PropTypes.bool.isRequired,
	segments: PropTypes.arrayOf(PropTypes.string).isRequired,
	selectedIndex: PropTypes.number.isRequired,
	onPress: PropTypes.func.isRequired,
}

NavBarTitleSegmentedControl.defaultProps = {
	lightSegmentedControl: false,
}


// StyleSheet
const {
	size,
	navBar: { navTitleWrapper },
} = ss

const styles = ss.create({
	navTitleWrapper: {
		...navTitleWrapper,
		top: ss.constants.HEIGHT_STATUS_BAR / size(2),
	},
	navTitle: {
		// backgroundColor: 'pink', // NOTE testing flexbox
		width: ss.constants.WIDTH_NAV_BAR_TITLE,
		alignSelf: 'center',
		paddingTop: 2,
	},
})

const mapStateToProps = state => ({
	locale: state.app.locale,
})

export default connect(mapStateToProps, null)(NavBarTitleSegmentedControl)
