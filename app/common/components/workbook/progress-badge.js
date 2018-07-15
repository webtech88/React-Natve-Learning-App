import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
	View,
	Text,
	Animated,
} from 'react-native'

import Svg, { Circle, Polyline } from 'react-native-svg'

import ss from '../../../styles'
import TransText from '../core/transtext'

// accomplished
const ACCOMPLISHED_POLYLINE_DOWN = 50
const ACCOMPLISHED_POLYLINE_UP_X = 85
const ACCOMPLISHED_POLYLINE_UP_Y = 15


class ProgressBadge extends Component {

	constructor(props) {
		super(props)

		const { percentage, animated } = this.props

		this.state = {
			// progress
			animPercentage: new Animated.Value(0),
			percentage: animated ? 0 : percentage,
			// accomplished
			animAccomplishedDown: new Animated.Value(30),
			animAccomplishedUpX: new Animated.Value(50),
			animAccomplishedUpY: new Animated.Value(50),
			accomplishedPointsDown: animated ? 30 : ACCOMPLISHED_POLYLINE_DOWN,
			accomplishedPointsUpX: animated ? 0 : ACCOMPLISHED_POLYLINE_UP_X,
			accomplishedPointsUpY: animated ? 0 : ACCOMPLISHED_POLYLINE_UP_Y,
		}
	}

	componentWillMount() {
		// progress
		this.state.animPercentage.addListener((event) => {
			this.setState({ percentage: event.value })
		})

		// accomplished
		this.state.animAccomplishedDown.addListener((event) => {
			this.setState({ accomplishedPointsDown: event.value })
		})
		this.state.animAccomplishedUpX.addListener((event) => {
			this.setState({ accomplishedPointsUpX: event.value })
		})
		this.state.animAccomplishedUpY.addListener((event) => {
			this.setState({ accomplishedPointsUpY: event.value })
		})
	}

	componentDidMount() {
		if (this.props.animated && this.props.percentage > 0) {
			this.animate(this.props.percentage)
		}
	}

	componentWillReceiveProps(newProps) {
		const { animated, percentage } = this.props
		const { animated: newAnimated, percentage: newPercentage } = newProps

		if ((!animated && newAnimated) || percentage !== newPercentage) {
			this.animate(newPercentage)
		}
	}

	componentWillUnmount() {
		// progress
		this.state.animPercentage.stopAnimation()
		this.state.animPercentage.removeListener()
		// accomplished
		this.state.animAccomplishedDown.stopAnimation()
		this.state.animAccomplishedDown.removeListener()
		this.state.animAccomplishedUpX.stopAnimation()
		this.state.animAccomplishedUpX.removeListener()
		this.state.animAccomplishedUpY.stopAnimation()
		this.state.animAccomplishedUpY.removeListener()
	}

	dimensionsSize(size, dimensions = this.props.dimensions) {
		return (size / 100) * dimensions
	}

	animate = (percentage) => {
		const sequence = Animated.sequence
		const delay = Animated.delay
		const spring = Animated.spring

		if (percentage >= 100 && !this.props.children) { // make it possible to use 100% when you pass children
			// accomplished
			sequence([
				delay(200),
				Animated.timing(this.state.animAccomplishedDown, {
					toValue: ACCOMPLISHED_POLYLINE_DOWN,
					duration: 250,
					useNativeDriver: true,
				}),
				Animated.parallel([
					spring(this.state.animAccomplishedUpX, {
						toValue: ACCOMPLISHED_POLYLINE_UP_X,
						friction: 12,
						useNativeDriver: true,
					}),
					spring(this.state.animAccomplishedUpY, {
						toValue: ACCOMPLISHED_POLYLINE_UP_Y,
						friction: 12,
						useNativeDriver: true,
					}),
				]),
			]).start()
		} else {
			// progress
			sequence([
				delay(200),
				spring(this.state.animPercentage, {
					toValue: percentage,
					friction: 10,
					tension: 5,
					useNativeDriver: true,
				}),
			]).start()
		}
	}


	renderProgressBadge = () => {
		const {
			style,
			dimensions,
			percentageStrokeWidth,
			colorPrimary,
			colorSecondary,
			colorStroke,
			colorStrokeFill,
			colorText,
			children,
			shadow,
		} = this.props

		// badge
		const fontSize = this.dimensionsSize(38)
		const paddingBadge = this.dimensionsSize(4)

		// progress
		const progressDimensions = (this.props.dimensions - (paddingBadge * 2))
		const strokeWidth = this.dimensionsSize(6.5, progressDimensions)
		// TODO currently doing doggy rotate hack
		// @andris: will learn about these later: strokeDasharray & strokeDashoffset
		const strokeDasharray = (progressDimensions - (strokeWidth * 1.25)) * Math.PI
		const strokeDashoffset = strokeDasharray - ((strokeDasharray / 100) * this.state.percentage)
		const radius = (progressDimensions - (percentageStrokeWidth || strokeWidth)) / 2

		return (
			<View style={[{
				width: dimensions,
				height: dimensions,
				padding: paddingBadge,
				borderRadius: dimensions,
				backgroundColor: colorSecondary,
			}, shadow && styles.shadow, style]}
			>
				<View style={styles.progress}>
					<Svg height={progressDimensions} width={progressDimensions}>
						<Circle
							cx={progressDimensions / 2}
							cy={progressDimensions / 2}
							r={radius}
							stroke={colorStroke}
							strokeWidth={percentageStrokeWidth || strokeWidth}
							fill="none"
						/>
						<Circle
							cx={progressDimensions / 2}
							cy={progressDimensions / 2}
							r={radius}
							stroke={colorStrokeFill || colorPrimary}
							strokeWidth={percentageStrokeWidth || strokeWidth}
							strokeLinecap="round"
							strokeDasharray={strokeDasharray.toString()}
							strokeDashoffset={strokeDashoffset.toString()}
							fill="none"
						/>
					</Svg>
					<View style={styles.percentage}>
						{children || (
							<TransText 
								style={[
									styles.percentSign,
									{
										fontSize,
										color: colorText,
										paddingBottom: this.dimensionsSize(10),
									},
								]}
								transkey={Math.round(this.state.percentage)}
								innerbottom={<Text style={{ fontSize }}>%</Text>}
							/>
							)}
					</View>
				</View>
			</View>
		)
	}

	renderAccomplishedBadge = () => {
		const {
			style,
			dimensions,
			colorPrimary,
			colorSecondary,
			children,
		} = this.props
		const { accomplishedPointsDown, accomplishedPointsUpX, accomplishedPointsUpY } = this.state

		// badge
		const paddingBadge = this.dimensionsSize(7.5)
		const paddingCont = this.dimensionsSize(5.5)

		// stroke
		const strokeDimensions = (this.props.dimensions - (paddingBadge * 2) - (paddingCont * 2))
		const strokeWidth = this.dimensionsSize(4)
		const strokeOffsetX = -this.dimensionsSize(7.4)
		const strokeOffsetY = this.dimensionsSize(14.8)

		// polyline
		let polylinePoints = `${this.dimensionsSize(30, strokeDimensions)},${this.dimensionsSize(30, strokeDimensions)}`
		polylinePoints += ` ${this.dimensionsSize(accomplishedPointsDown, strokeDimensions)},${this.dimensionsSize(accomplishedPointsDown, strokeDimensions)}`

		if (accomplishedPointsUpX && accomplishedPointsUpY) {
			polylinePoints += ` ${this.dimensionsSize(accomplishedPointsUpX, strokeDimensions)},${this.dimensionsSize(accomplishedPointsUpY, strokeDimensions)}`
		}

		return (
			<View style={[{
				width: dimensions,
				height: dimensions,
				padding: paddingBadge,
				borderRadius: dimensions,
				backgroundColor: colorPrimary,
			}, style]}
			>
				<View style={{
					borderRadius: dimensions,
					borderWidth: paddingCont,
					borderColor: colorSecondary,
				}}
				>
					<Svg
						height={strokeDimensions}
						width={strokeDimensions}
					>
						<Polyline
							points={polylinePoints}
							fill="none"
							x={strokeOffsetX}
							y={strokeOffsetY}
							stroke={colorSecondary}
							strokeWidth={strokeWidth}
						/>
					</Svg>
				</View>
			</View>
		)
	}

	// Don't render accomplished when we passs children
	render() {
		const { percentage, children } = this.props

		return (percentage >= 100 && !children) ? this.renderAccomplishedBadge() : this.renderProgressBadge()
	}

}

ProgressBadge.propTypes = {
	dimensions: PropTypes.number.isRequired,
	percentage: PropTypes.number.isRequired,
	percentageStrokeWidth: PropTypes.number,
	colorPrimary: PropTypes.string.isRequired,
	colorSecondary: PropTypes.string.isRequired,
	colorStroke: PropTypes.string.isRequired,
	colorStrokeFill: PropTypes.string,
	colorText: PropTypes.string,
	animated: PropTypes.bool.isRequired,
	shadow: PropTypes.bool,
}

ProgressBadge.defaultProps = {
	dimensions: 75,
	percentage: 0,
	colorPrimary: ss.constants.COLOR_CORE_BRAND,
	colorSecondary: 'white',
	colorStroke: 'rgba(0, 0, 0, .05)',
	colorText: ss.constants.COLOR_CORE_BRAND,
	animated: false,
	shadow: true,
}


// StyleSheet
const {
	size,
	typo: { h1 },
} = ss

const styles = ss.create({
	// Progress badge
	shadow: {
		shadowColor: 'black',
		shadowOpacity: 0.15,
		shadowRadius: size(15),
		elevation: 2,
	},
	progress: {
		backgroundColor: 'transparent',
		transform: [{ rotate: '-90deg' }], // TODO
	},
	percentage: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		justifyContent: 'center',
		transform: [{ rotate: '90deg' }], // TODO
	},
	percentSign: {
		backgroundColor: 'transparent',
		...h1,
		textAlign: 'center',
	},
})

export default ProgressBadge
