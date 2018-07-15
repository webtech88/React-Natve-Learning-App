import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
	View,
	ViewPropTypes,
	Text,
	TouchableOpacity,
} from 'react-native'

import ss from '../../../styles'
import TransText from './transtext'

const COLOR_LIGHT = ss.constants.COLOR_CORE_LIGHT
const COLOR_DARK = ss.constants.COLOR_CORE_PRIMARY

class SegmentedControl extends Component {

	renderTab(tab, index) {
		const { light, selectedIndex, onPress } = this.props
		const active = selectedIndex === index
		const Tab = active ? View : TouchableOpacity

		return (
			<Tab
				key={index}
				style={[
					styles.tab,
					active && (light ? { backgroundColor: COLOR_LIGHT } : { backgroundColor: COLOR_DARK }),
					(index > 0) && { borderLeftWidth: 1 },
					(index > 0) && (light ? { borderColor: COLOR_LIGHT } : { borderColor: COLOR_DARK }),
				]}
				onPress={() => onPress(index)}
				activeOpacity={0.9}
			>
				<TransText
					style={[
						styles.tabText,
						light ? { color: COLOR_LIGHT } : { color: COLOR_DARK },
						active && (light ? { color: ss.constants.COLOR_CORE_DARK } : { color: COLOR_LIGHT }),
					]}
					numberOfLines={1}
					transkey={tab}
				/>
			</Tab>
		)
	}

	render() {
		const { light, style, segments } = this.props

		return (
			<View style={[styles.segmentedControl, style]}>
				<View style={[
					styles.tabs,
					light ? { borderColor: COLOR_LIGHT } : { borderColor: COLOR_DARK },
				]}
				>
					{segments.map((tab, index) => this.renderTab(tab, index))}
				</View>
			</View>
		)
	}
}

SegmentedControl.propTypes = {
	light: PropTypes.bool.isRequired,
	style: ViewPropTypes.style,
	segments: PropTypes.arrayOf(PropTypes.string).isRequired,
	selectedIndex: PropTypes.number.isRequired,
	onPress: PropTypes.func.isRequired,
}

SegmentedControl.defaultProps = {
	light: false,
	style: null,
}


// StyleSheet
const {
	size,
	typo: { p },
} = ss

const styles = ss.create({
	segmentedControl: {
		backgroundColor: 'transparent',
		// backgroundColor: 'pink', // NOTE testing flexbox
		paddingVertical: size(8),
		paddingHorizontal: size(20),
		height: ss.constants.HEIGHT_SEGMENTED_CONTROL,
	},
	tabs: {
		flex: 1,
		flexDirection: 'row',
		borderWidth: 1,
		borderRadius: size(4),
	},
	tab: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingBottom: 1,
	},
	tabText: {
		...p,
		fontSize: size(13),
	},
})

export default SegmentedControl
