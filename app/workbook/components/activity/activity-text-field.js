import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
    View,
    TextInput,
	Text,
	StyleSheet,
	Platform,
} from 'react-native'

import { AutoGrowingTextInput } from 'react-native-autogrow-textinput'

import ss from '../../../styles'
import common from '../../../common'

const { TransText, TransTextInput } = common.components.core

const HEIGHT_INPUT = ss.size(42)

class ActivityTextField extends Component {
	state = {
		inputHeight: HEIGHT_INPUT,
	}

	render() {
		const {
			input: { name, value, onChange, onFocus, onBlur },
			label, placeholder, ...otherProps
		} = this.props

		const Input = Platform.OS === 'android' ? AutoGrowingTextInput : TextInput
		return (
			<View ref={`Field_${name}`} style={styles.container}>
				<TransText ref={(t) => { this.label = t }} style={styles.label} transkey={label} />
				<TransTextInput
					ref={name}
					component={Input}
					style={[
						styles.input,
						{ height: Platform.OS === 'android'
								? this.state.inputHeight
								: 'auto',
						},
					]}
					underlineColorAndroid="transparent" // NOTE Android only
					keyboardAppearance="dark" // NOTE iOS only
					placeholder={placeholder}
					placeholderTextColor="rgba(0, 0, 0, 0.3)"
					multiline
					onChangeText={onChange}
					onContentSizeChange={({ nativeEvent }) => {
						if (Platform.OS === 'android') {
							this.setState({ inputHeight: nativeEvent.contentSize.height })
						}
					}}
					value={value.toString()}
					onFocus={onFocus}
					onBlur={onBlur}
					{...otherProps}
				/>
			</View>
		)
	}
}

ActivityTextField.propTypes = {
	input: PropTypes.shape({
		name: PropTypes.string.isRequired,
		onChange: PropTypes.func.isRequired,
		onFocus: PropTypes.func,
		onBlur: PropTypes.func,
		value: PropTypes.string,
	}).isRequired,
	multiline: PropTypes.bool,
	label: PropTypes.string.isRequired,
	placeholder: PropTypes.string.isRequired,
}

ActivityTextField.defaultProps = {
	multiline: true,
	placeholder: 'Write your answer here',
}

// StyleSheet
const {
	size,
	typo: { p },
} = ss

const styles = ss.create({
	container: {
		borderBottomColor: 'rgba(0, 0, 0, 0.5)',
		borderBottomWidth: StyleSheet.hairlineWidth,
	},
	input: {
		...p,
		paddingTop: size(6),
		paddingBottom: 5,
		paddingHorizontal: 0, // NOTE Android only
		backgroundColor: 'transparent',
	},
	label: {
		...p,
		fontSize: size(16),
		color: ss.constants.COLOR_CORE_BRAND,
	},
})

export default ActivityTextField
