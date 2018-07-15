import PropTypes from 'prop-types'
import React from 'react'
import {
	ActivityIndicator,
	TouchableHighlight,
	View,
	ViewPropTypes
} from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome'
import ss from '../../../styles'
import TransText from './transtext'

// NOTE
// button is flex so always full width
// icons taken from FontAwesome
// icon centered when no label

const Button = ({
	style, type, height,
	color, labelColor, borderRadius, label,
	iconName, disabled, isLoading,
	activeOpacity, onPress, iconSize,
}) => {
	const renderIcon = () => {
		const iconStyles = label ? styles.iconLeft : styles.iconCenter
		return (
			<View style={[iconStyles, { height }]}>
				<Icon style={{ color: (type === 'fill') ? labelColor || 'white' : color }}
					name={iconName} size={size(iconSize)}
				/>
			</View>
		)
	}

	const renderLabel = () => (
		<View style={{ flex: 1 }}>
			<TransText
				numberOfLines={1}
				style={[styles.label, { color: (type === 'fill') ? labelColor || 'white' : color }]} 
				transkey={label}/>
		</View>
	)

	const renderLoading = () => (
		<ActivityIndicator color={(type === 'fill') ? labelColor || 'white' : color} size="small" />
	)

	const Container = disabled ? View : TouchableHighlight

	return (
		<View style={style}>
			<Container
				style={[
					{
						opacity: disabled ? (isLoading ? 0.8 : 0.5) : 1,
						height,
					},
				]}
				activeOpacity={activeOpacity}
				underlayColor="transparent"
				onPress={onPress}
			>
				<View style={[
					styles.button,
					{
						backgroundColor: (type === 'fill') ? color : 'transparent',
						borderWidth: (type === 'outline') ? 1 : 0,
						borderColor: color,
						borderRadius,
					},
				]}
				>
					{iconName && !isLoading ? renderIcon() : null}
					{isLoading ? renderLoading() : (label ? renderLabel() : null)}
				</View>
			</Container>
		</View>
	)
}

Button.propTypes = {
	type: PropTypes.oneOf(['fill', 'outline']).isRequired,
	style: ViewPropTypes.style,
	height: PropTypes.number.isRequired,
	color: PropTypes.string.isRequired,
	labelColor: PropTypes.string,
	borderRadius: PropTypes.number,
	label: PropTypes.string,
	disabled: PropTypes.bool,
	isLoading: PropTypes.bool,
	activeOpacity: PropTypes.number,
	iconName: PropTypes.string,
	iconSize: PropTypes.number,
	onPress: PropTypes.func.isRequired,
}

Button.defaultProps = {
	type: 'fill',
	style: null,
	height: ss.constants.HEIGHT_BUTTON_LARGE,
	color: ss.constants.COLOR_CORE_PRIMARY,
	labelColor: null,
	borderRadius: 5,
	label: null,
	disabled: false,
	isLoading: false,
	activeOpacity: 0.9,
	iconName: null,
	iconSize: 24,
}


// StyleSheet

const {
	size,
	typo: { pSemiBold },
} = ss

const styles = ss.create({
	button: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	label: {
		...pSemiBold,
		color: 'white',
		textAlign: 'center',
		paddingLeft: 5,
		paddingRight: 5,
		paddingBottom: 2,
	},
	iconLeft: {
		justifyContent: 'center',
		position: 'absolute',
		top: 0,
		left: size(20),
		zIndex: 10,
	},
	iconCenter: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
})

export default Button
