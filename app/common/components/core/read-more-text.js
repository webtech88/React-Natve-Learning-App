import React, { Component } from 'react'
import {
	StyleSheet,
	View,
	LayoutAnimation,
	Platform,
} from 'react-native'

import ss from '../../../styles'
import TransText from './transtext'

const LayoutSpringAnim = {
	duration: 200,
	create: {
		type: LayoutAnimation.Types.linear,
		property: LayoutAnimation.Properties.opacity,
	},
	update: {
		type: LayoutAnimation.Types.spring,
		property: LayoutAnimation.Properties.opacity,
		springDamping: 1.4,
	},
	delete: {
		type: LayoutAnimation.Types.linear,
		property: LayoutAnimation.Properties.opacity,
	},
}

function measureHeightAsync(component) {
	return new Promise((resolve, reject) => {
		if (component) {
			if (Platform.OS === 'ios') {
				component.measure((x, y, w, h) => {
					resolve(h)
				})
			} else {
				component.measureInWindow((x, y, w, h) => {
					resolve(h)
				})
			}
		} else {
			reject()
		}
	})
}

function nextFrameAsync() {
	return new Promise(resolve => requestAnimationFrame(id => resolve(id)))
}

class ReadMoreText extends Component {

	state = {
		measured: false,
		shouldShowReadMore: false,
		showAllText: false,
	}

	async componentDidMount() {
		// Get the height of the text with no restriction on number of lines
		try {
			await nextFrameAsync()
			const fullHeight = await measureHeightAsync(this.text)
			// console.log(this.props.children, fullHeight)
			this.setState({ measured: true })

			// Get the height of the text now that number of lines has been set
			try {
				await nextFrameAsync()
				const limitedHeight = await measureHeightAsync(this.text)
				// console.log(this.props.children, limitedHeight)
				if (fullHeight > limitedHeight) {
					this.setState({ shouldShowReadMore: true })
				}
			} catch (e) {
				// console.log('limited height', e)
			}
		} catch (e) {
			// console.log('full height', e)
		}

		// console.log('async componentDidMount failed ???')
	}

	componentWillUpdate(nextProps, nextState) {
		if (this.state.showAllText !== nextState.showAllText) {
			LayoutAnimation.configureNext(LayoutSpringAnim)
		}
	}

	handlePress = () => {
		this.setState({ showAllText: !this.state.showAllText })
	}

	maybeRenderReadMore = () => {
		if (this.state.shouldShowReadMore) {
			return (
				<TransText 
					style={[this.props.style, styles.link]} 
					suppressHighlighting onPress={this.handlePress} 
					transkey={this.state.showAllText ? 'less' : 'more'} 
				/>
			)
		}

		return null
	}

	render() {
		const {
			measured,
			shouldShowReadMore,
			showAllText,
		} = this.state

		const {
			style,
			numberOfLines,
			children,
		} = this.props
		let otherProps
		if (measured && shouldShowReadMore) {
			otherProps = {
				onPress: this.handlePress,
			}
		}

		return (
			<View>
				<TransText
					ref={(c) => { this.text = c }}
					style={style}
					numberOfLines={measured && !showAllText ? numberOfLines : 0}
					transkey={children}
					suppressHighlighting
					{...otherProps}
				/>
				{this.maybeRenderReadMore()}
			</View>
		)
	}

}

// StyleSheet
const styles = StyleSheet.create({
	link: {
		color: ss.constants.COLOR_LINK,
	},
})

export default ReadMoreText
