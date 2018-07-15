import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
	ScrollView,
	View,
	TouchableOpacity,
} from 'react-native'

import ss from '../../../styles'
import common from '../../../common'

const { IconToggle, TransText } = common.components.core


class ShowreelInfo extends Component {

	componentWillReceiveProps(nextProps) {
		if (this.props.toggled !== nextProps.toggled) {
			this.showreelInfoScroll.scrollTo({ x: 0, y: 0, animated: false })
		}
	}

	render() {
		const { content, toggled, onToggle } = this.props

		return (
			<View>
				<ScrollView
					ref={(ref) => { this.showreelInfoScroll = ref }}
					style={styles.scroll}
					contentContainerStyle={styles.scrollContainer}
					directionalLockEnabled
					// scrollIndicatorInsets={{ right: -size(7) }} // iOS only
					indicatorStyle="white" // iOS only
				>
					<TouchableOpacity activeOpacity={0.95} onPress={onToggle}>
						<TransText style={styles.p} numberOfLines={toggled ? 0 : 3} transkey={content} />
					</TouchableOpacity>
				</ScrollView>
				<TouchableOpacity style={styles.iconToggle} activeOpacity={0.95} onPress={onToggle}>
					<IconToggle iconStyle="light" expanded={toggled} />
				</TouchableOpacity>
			</View>
		)
	}

}

ShowreelInfo.propTypes = {
	content: PropTypes.string.isRequired,
	toggled: PropTypes.bool.isRequired,
	onToggle: PropTypes.func.isRequired,
}


// StyleSheet
const {
	size,
	typo: { p },
} = ss

const styles = ss.create({
	scroll: {
		// backgroundColor: 'pink', // NOTE testing flexbox
		marginTop: size(25),
		marginRight: -size(15),
		paddingRight: size(15),
	},
	scrollContainer: {
		// backgroundColor: 'pink', // NOTE testing flexbox
		paddingHorizontal: size(15),
	},
	p: {
		...p,
		color: 'white',
		textAlign: 'center',
	},
	iconToggle: {
		// backgroundColor: 'pink', // NOTE testing flexbox
		position: 'absolute',
		top: size(20),
		right: -size(10),
		zIndex: 1,
		padding: size(10),
	},
})

export default ShowreelInfo
