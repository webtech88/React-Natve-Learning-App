import React, { Component } from 'react'
import {
	View,
	ViewPropTypes,
	Animated,
	Image,
	Platform,
} from 'react-native'

import PropTypes from 'prop-types'

import R from 'ramda'

import NavBarButtons from './navbar-buttons'
import NavBarIconButton from './navbar-icon-button'
import TransAnimatedText from '../core/transanimated-text'

import ss from '../../../styles'

class NavBar extends Component {

	renderLeft() {
		const { leftButtonImage, onLeft } = this.props

		if (leftButtonImage && onLeft && typeof onLeft === 'function') {
			return (
				<NavBarButtons position="left">
					<NavBarIconButton
						key={'NavBarLeftButton_1'}
						image={leftButtonImage}
						onPress={onLeft}
					/>
				</NavBarButtons>
			)
		}

		return null
	}

	renderLeftButton() {
		const { renderLeftButton, leftButtonStyle } = this.props

		if (renderLeftButton) {
			return (
				<NavBarButtons position="left" navBarButtonStyle={leftButtonStyle}>
					{renderLeftButton()}
				</NavBarButtons>
			)
		}

		return null
	}

	renderRight() {
		let { rightButtonImage, onRight } = this.props

		if (rightButtonImage && onRight) {
			let buttons = 0

			// lets create an array if needed
			if (!Array.isArray(rightButtonImage)) {
				rightButtonImage = [rightButtonImage]
			}

			if (!Array.isArray(onRight)) {
				onRight = [onRight]
			}

			// both rightButtonImage && onRight must be set
			// lets check if array count matches
			if (rightButtonImage.length !== onRight.length) return null

			// all valid return buttons
			buttons = rightButtonImage.length

			return (
				<NavBarButtons position="right">
					{R.range(0, buttons).map((button) => {
						if (typeof onRight[button] === 'function') {
							return (
								<NavBarIconButton
									key={`NavBarRightButton_${button}`}
									style={{ marginLeft: size(15) }}
									image={rightButtonImage[button]}
									onPress={onRight[button]}
								/>
							)
						}
					})}
				</NavBarButtons>
			)
		}

		return null
	}

	renderRightButton() {
		const { renderRightButton, rightButtonStyle } = this.props

		if (renderRightButton) {
			return (
				<NavBarButtons position="right" navBarButtonStyle={rightButtonStyle}>
					{Platform.OS === 'ios'
						? renderRightButton()
						: <View style={styles.androidFix}>
							{renderRightButton()}
						</View>
					}
				</NavBarButtons>
			)
		}

		return null
	}

	renderTitle() {
		const { title, tindices, titleWrapperStyle, titleStyle } = this.props

		if (title) {
			if (tindices) {
				return (
					<View style={[styles.navTitleWrapper, titleWrapperStyle]}>
						<TransAnimatedText style={[styles.navTitle, titleStyle]}
							lineBreakMode="tail"
							numberOfLines={1}
							transkeys={title}
							tindices={tindices}
						/>
					</View>
				)
			} else {
				return (
					<View style={[styles.navTitleWrapper, titleWrapperStyle]}>
						<TransAnimatedText style={[styles.navTitle, titleStyle]}
							lineBreakMode="tail"
							numberOfLines={1}
							transkey={title}
						/>
					</View>
				)
			}
		}

		return null
	}

	render() {
		const { navigationBarStyle, panResponder } = this.props

		return (
			<View style={[styles.navBar, navigationBarStyle]} {...panResponder}>
				{this.renderLeftButton() || this.renderLeft()}
				{this.renderTitle()}
				{this.renderRightButton() || this.renderRight()}
			</View>
		)
	}

}


NavBar.propTypes = {
	title: PropTypes.string.isRequired,
	titleWrapperStyle: ViewPropTypes.style,
	titleStyle: Animated.Text.propTypes.style,
	renderCustomTitle: PropTypes.func,
	leftButtonImage: Image.propTypes.source,
	onLeft: PropTypes.func,
	renderLeftButton: PropTypes.func,
	leftButtonStyle: ViewPropTypes.style,
	rightButtonImage: PropTypes.oneOfType([Image.propTypes.source, PropTypes.array]),
	onRight: PropTypes.oneOfType([PropTypes.func, PropTypes.array]),
	navigationBarStyle: ViewPropTypes.style,
	renderRightButton: PropTypes.func,
	rightButtonStyle: ViewPropTypes.style,
}

NavBar.defaultProps = {
	title: '',
	titleWrapperStyle: {},
	titleStyle: {},
	renderCustomTitle: null,
	leftButtonImage: null,
	onLeft: null,
	renderLeftButton: null,
	leftButtonStyle: {},
	rightButtonImage: null,
	onRight: null,
	rightButtonStyle: {},
	navigationBarStyle: {},
	renderRightButton: null,
}


// StyleSheet

const {
	size,
	navBar: { navBar, navTitleWrapper, navTitle },
} = ss

const styles = ss.create({
	navBar: {
		...navBar,
	},
	navTitleWrapper: {
		...navTitleWrapper,
	},
	customTitleWrapperStyle: {
		alignItems: 'center',
		marginTop: size(5),
	},
	navTitle: {
		...navTitle,
	},
	androidFix: {
		position: 'absolute',
		top: -(ss.constants.HEIGHT_STATUS_BAR - size(10)),
		right: 0,
		left: 0,
		bottom: 0,
		alignItems: 'center',
		justifyContent: 'center',
	},
})

export default NavBar
