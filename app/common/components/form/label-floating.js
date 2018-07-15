import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
	Animated,
	Easing,
} from 'react-native'

import ss from '../../../styles'
import TransAnimatedText from '../core/transanimated-text'

class FloatingLabel extends Component {

	constructor(props) {
		super(props)

		// Set label animated values
		const style = this.props.value ? animDirty : animClean
		this.state = {
			animZIndex: new Animated.Value(style.animZIndex),
			animTop: new Animated.Value(style.animTop),
			animFontSize: new Animated.Value(style.animFontSize),
			animOpacity: new Animated.Value(style.animOpacity),
		}
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.value !== nextProps.value) {
			if ((this.props.value === '' && nextProps.value !== '')
				|| (this.props.value !== '' && nextProps.value === '')) {
				this.animate(!!nextProps.value)
			}
		}
	}

	animate(dirty) {
		const nextStyle = dirty ? animDirty : animClean
		const styles = this.state
		const anims = Object.keys(nextStyle).map(prop =>
			// if (styles[prop]) {
				Animated.timing(
					styles[prop],
					{
						toValue: nextStyle[prop],
						duration: 150,
						// useNativeDriver: true,
					},
					Easing.ease,
				),
			// }
		)

		Animated.parallel(anims).start()
	}

	render() {
		const { label, required, error } = this.props

		return (
			<TransAnimatedText
				ref={(c) => { this.label = c }} numberOfLines={1}
				style={[
					styles.label,
					{ zIndex: this.state.animZIndex, top: this.state.animTop, fontSize: this.state.animFontSize },
				]}
				transkey={!error && required ? 'COMMA_REQUIRED' : ''}
				innertop={<TransAnimatedText 
									style={[{ opacity: this.state.animOpacity }, (error && styles.error)]}
									transkey={error ? 'FIELD_REQUIRED' : label} 
							/>}
			/>
		)
	}
}

FloatingLabel.propTypes = {
	label: PropTypes.string.isRequired,
	value: PropTypes.oneOfType([
		PropTypes.number.isRequired,
		PropTypes.string.isRequired,

	]),
	required: PropTypes.bool.isRequired,
	error: PropTypes.string.isRequired,
}

FloatingLabel.defaultProps = {
	required: false,
	error: '',
}


// StyleSheet

const {
	size,
	typo: { p },
} = ss

const animClean = {
	animZIndex: 0,
	animTop: size(21),
	animFontSize: size(15),
	animOpacity: 0.5,
}

const animDirty = {
	animZIndex: 1,
	animTop: -size(3),
	animFontSize: size(12),
	animOpacity: 0.7,
}

const styles = ss.create({
	label: {
		...p,
		position: 'absolute',
		left: -size(5),
		paddingRight: size(20),
		paddingLeft: size(5),
		paddingBottom: size(5),
		backgroundColor: 'transparent',
	},
	error: {
		color: ss.constants.COLOR_ACCENT_RED,
		opacity: 1,
	},
})

export default FloatingLabel
