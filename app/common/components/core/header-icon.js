import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
	View,
	ViewPropTypes,
	Animated,
} from 'react-native'

import Icon from './icon'

import ss from '../../../styles'

class HeaderIcon extends Component {
	state = {
		animOpacity: new Animated.Value(0),
		animTransform: new Animated.Value(0.25),
	}

	componentDidMount() {
		const parallel = Animated.parallel
		const spring = Animated.spring

		parallel([
			spring(this.state.animOpacity, {
				toValue: 1,
				friction: 9,
			}),
			spring(this.state.animTransform, {
				toValue: 1,
				friction: 12,

			}),
		]).start()
	}

	render() {
		const { name, size, style, iconStyle } = this.props

		return (
			<Animated.View style={[
				styles.iconOuter,
				style,
				{
					opacity: this.state.animOpacity,
					transform: [{ scale: this.state.animTransform }],
				},
			]}
			>
				<View style={styles.iconInner} />
				<View style={[styles.vectorIconContainer, iconStyle]}>
					<Icon name={name} size={size} />
				</View>
			</Animated.View>
		)
	}

}

HeaderIcon.propTypes = {
	name: PropTypes.string,
	size: PropTypes.number,
	style: ViewPropTypes.style,
	iconStyle: ViewPropTypes.style,
}

HeaderIcon.defaultProps = {
	name: undefined,
	size: ss.size(65),
	style: null,
	iconStyle: {},
}


// StyleSheet

const {
	size,
} = ss

const styles = ss.create({
	iconOuter: {
		justifyContent: 'center',
		alignItems: 'center',
		alignSelf: 'center',
		backgroundColor: '#F3FBFA',
		width: size(135),
		height: size(135),
		borderRadius: 135,
	},
	iconInner: {
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#DDEEEA',
		width: size(75),
		height: size(75),
		borderRadius: 75,
	},
	vectorIconContainer: {
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		alignItems: 'center',
		justifyContent: 'center',
	},
})

export default HeaderIcon
