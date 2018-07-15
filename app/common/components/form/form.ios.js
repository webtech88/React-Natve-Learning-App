import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
	ScrollView,
	View,
	Keyboard,
	LayoutAnimation,
	TouchableWithoutFeedback,
	UIManager,
} from 'react-native'

import DismissKeyboard from 'dismissKeyboard'
import ss from '../../../styles'

// Keyboard events are native
// DatePicker events are not so this component needs to know when should show/hide datepicker
class Form extends Component {
	state = {
		scrollY: 0,
		scrollH: 0,
		contentH: 0,
		avoidingSpace: 0,
		keyboardIsOpen: false,
		datePickerIsOpen: false,
	}

	componentWillMount() {
		this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow)
		this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide)
		this.layoutAnimationConfig = LayoutAnimation.create(150, 'keyboard', 'opacity')
	}

	componentWillReceiveProps(nextProps) {
		const { shouldAvoidDatePicker, activeHandle } = nextProps

		// handle datepicker state
		if (this.props.shouldAvoidDatePicker !== nextProps.shouldAvoidDatePicker) {
			if (nextProps.shouldAvoidDatePicker) {
				this.datePickerWillShow()
			} else {
				this.datePickerWillHide()
			}
		}

		// handle active field scroll
		if (this.props.activeHandle !== activeHandle && activeHandle) {
			this.scrollToFocusedField(activeHandle)
		}
	}

	componentWillUpdate(nextProps, nextState) {
		// console.log('will update', this.state.scrollY, this.state.scrollH, this.state.contentH);
		if (this.state.avoidingSpace !== nextState.avoidingSpace) {
			LayoutAnimation.configureNext(this.layoutAnimationConfig)

			// TODO BUG ScrollView contentInset prop not updated as avoidingSpace set to 0
			if (nextState.avoidingSpace === 0 && this.formScrollView) {
				const { scrollY, scrollH, contentH } = this.state
				const scrollTo = Math.max(0, contentH - scrollH)

				if (scrollY > scrollTo) {
					this.formScrollView.scrollTo({ x: 0, y: scrollTo, animated: true })
				}
			}
		}
	}

	componentWillUnmount() {
		this.keyboardWillShowListener.remove()
		this.keyboardWillHideListener.remove()
	}

	keyboardWillShow = () => {
		this.updateState(true, false)
	}

	keyboardWillHide =() => {
		this.updateState(false, this.state.datePickerIsOpen)
	}

	datePickerWillShow() {
		if (this.state.keyboardIsOpen) {
			DismissKeyboard()
		}

		this.updateState(false, true)
	}

	datePickerWillHide() {
		this.updateState(this.state.keyboardIsOpen, false)
	}

	updateState(keyboardIsOpen, datePickerIsOpen) {
		let newState

		// update avoidingSpace
		if (!keyboardIsOpen && !datePickerIsOpen) {
			newState = { ...newState, avoidingSpace: 0, keyboardIsOpen: false, datePickerIsOpen: false }
		} else {
			newState = { ...newState, avoidingSpace: ss.constants.HEIGHT_KEYBOARD }
		}

		// keyboard will show
		if (keyboardIsOpen) {
			newState = { ...newState, keyboardIsOpen: true, datePickerIsOpen: false }
		}

		// datepicker will show
		if (datePickerIsOpen) {
			newState = { ...newState, datePickerIsOpen: true, keyboardIsOpen: false }
		}

		// update state
		if (newState) {
			this.setState(newState, () => {
				// console.log('updateState', this.state);
				if (this.props.onStateChange) {
					this.props.onStateChange(this.state)
				}
			})
		}
	}

	// NOTE this is for flex only
	handleBlur = () => {
		// console.log('blur', this.state);
		// dismiss keyboard
		if (this.state.keyboardIsOpen) {
			// state reset on keyboardWillHide event
			DismissKeyboard()
		}
		// dismiss datepicker
		if (this.state.datePickerIsOpen) {
			// state reset manual
			this.datePickerWillHide()
		}
	}

	// NOTE this is for scroll only
	scrollToFocusedField(reactNode) {
		if (this.formScrollView) {
			// console.log(this.formScrollView);

			UIManager.measureLayoutRelativeToParent(
				reactNode,
				// (e) => {console.error(e)},
				() => null,
				(x, y, w, h) => {
					// console.log('h', h);
					// console.log('y', y);
					// console.log('scrollY', this.state.scrollY);
					// console.log('scrollH', this.state.scrollH);
					// console.log('contentH', this.state.contentH);
					// console.log('scroll', this.formScrollView);

					const scrollTo = Math.max(0, ((y - (this.state.scrollH - this.state.avoidingSpace)) + h))
					// console.log('scrollTo', scrollTo);
					this.formScrollView.scrollResponderScrollTo({ x: 0, y: scrollTo, animated: true })
				},
			)
		}
	}

	render() {
		const { style, behaviour, children } = this.props

		if (behaviour === 'flex') {
			return (
				<TouchableWithoutFeedback onPress={() => this.handleBlur()}>
					<View style={[{ flex: 1 }, style]}>
						{children}
						<View style={{ height: this.state.avoidingSpace }} />
					</View>
				</TouchableWithoutFeedback>
			)
		}

		if (behaviour === 'scroll') {
			return (
				<View style={{ flex: 1 }}>
					<ScrollView
						ref={(c) => { this.formScrollView = c }}
						// style={{ backgroundColor: 'blue' }}
						keyboardDismissMode="interactive"
						keyboardShouldPersistTaps="never"
						// TODO BUG top set to 20 after manual scrollTo
						contentInset={{ top: 0, bottom: this.state.avoidingSpace }}
						showsVerticalScrollIndicator
						scrollEventThrottle={0}
						onLayout={({ nativeEvent }) => this.setState({ scrollH: nativeEvent.layout.height })}
						onScroll={({ nativeEvent }) => this.setState({ scrollY: nativeEvent.contentOffset.y })}
					>
						<View
							style={style}
							onLayout={({ nativeEvent }) => this.setState({ contentH: nativeEvent.layout.height })}
						>{children}</View>
					</ScrollView>
					{/*
						TODO android does support contentInset ??
						<View style={{ height: this.state.avoidingSpace }} />
					*/}
				</View>
			)
		}

		return null
	}

}

Form.propTypes = {
	behaviour: PropTypes.oneOf(['flex', 'scroll']).isRequired,
	shouldAvoidDatePicker: PropTypes.bool.isRequired,
	children: PropTypes.node,
}

Form.defaultProps = {
	behaviour: 'flex',
	shouldAvoidDatePicker: false,
}


export default Form
