import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
	ScrollView,
	View,
	TouchableWithoutFeedback,
} from 'react-native'

import DismissKeyboard from 'dismissKeyboard'

// Keyboard events are native
// DatePicker events are not so this component needs to know when should show/hide datepicker
class Form extends Component {

	handleBlur = () => {
		DismissKeyboard()
	}

	render() {
		const { style, behaviour, children } = this.props

        // NOTE this is for flex only
		if (behaviour === 'flex') {
			return (
				<TouchableWithoutFeedback onPress={() => this.handleBlur()}>
					<View style={[{ flex: 1 }, style]}>
						{children}
					</View>
				</TouchableWithoutFeedback>
			)
		}

		if (behaviour === 'scroll') {
			return (
				<View style={{ flex: 1 }}>
					<ScrollView
						ref={(c) => { this.formScrollView = c }}
						keyboardDismissMode="interactive"
						keyboardShouldPersistTaps="never"
						showsVerticalScrollIndicator
					>
						<View style={style}>{children}</View>
					</ScrollView>
				</View>
			)
		}

		return null
	}

}

Form.propTypes = {
	behaviour: PropTypes.oneOf(['flex', 'scroll']).isRequired,
	children: PropTypes.node,
}

Form.defaultProps = {
	behaviour: 'flex',
	shouldAvoidDatePicker: false,
}

export default Form
