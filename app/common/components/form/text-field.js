import React, { Component } from 'react'
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	Platform,
} from 'react-native'

import { AutoGrowingTextInput } from 'react-native-autogrow-textinput'

import FloatingLabel from './label-floating'

import ss from '../../../styles'
import TransText from '../core/transtext'

import Icon from '../core/icon'

const HEIGHT_INPUT = ss.size(42)

class TextField extends Component {
	state = {
		showSecure: true,
		inputHeight: HEIGHT_INPUT,
	}

	toggleSecureTextEntry = () => {
		this.setState({ showSecure: !this.state.showSecure })
	}

	render() {
		const {
			input: { name, value, onChange, onFocus, onBlur },
			meta: { active, error, touched, valid },
			onInputFocus, label, notes, required, initialValue, secureTextEntry, disabled, ...otherProps
		} = this.props
		const labelError = (!active && error && touched && !valid) ? error : ''
		const { showSecure } = this.state
		// if (name == 'email') console.log(!active, error, touched, !valid);

		const Input = Platform.OS === 'android' && this.props.multiline ? AutoGrowingTextInput : TextInput
		return (
			<View ref={`Field_${name}`} style={[styles.container, (disabled && { opacity: 0.3 })]}>
				<View style={[styles.field, (active && styles.active)]}>
					<FloatingLabel label={label} value={value} required={required} error={labelError} />
					<Input
						ref={name}
						style={[
							styles.input,
							(labelError && styles.error),
							this.props.multiline && { height: Platform.OS === 'android'
								? this.state.inputHeight
								: 'auto',
								paddingTop: 10,
							},
						]}
						underlineColorAndroid="transparent" // NOTE Android only
						// placeholder={label} // NOTE using FloatingLabel
						onChangeText={onChange}
						onContentSizeChange={({ nativeEvent }) => {
							if (this.props.multiline && Platform.OS === 'android') {
								// TODO BUG form component scroll flickers
								this.setState({ inputHeight: nativeEvent.contentSize.height })
							}
						}}
						onFocus={onFocus}
						onBlur={onBlur}
						value={value.toString()}
						secureTextEntry={secureTextEntry ? showSecure : false}
						keyboardAppearance="dark" // NOTE iOS only
						{...otherProps}
					/>
					{secureTextEntry && <TouchableOpacity
						style={styles.eye}
						onPress={this.toggleSecureTextEntry}
						activeOpacity={0.9}
					>
						{showSecure
							? <Icon name={'eye-open'}
								size={ss.size(12)}
								style={{ opacity: 0.5 }}
							/>
							: <Icon name={'eye-closed'}
								size={ss.size(9)}
								style={{ opacity: 0.5, marginTop: 2 }}
							/>
						}
					</TouchableOpacity>}
				</View>
				{notes && <TransText style={styles.pSmall} transkey={notes} />}
			</View>
		)
	}
}

// StyleSheet

const {
	size,
	typo: { p },
} = ss

const styles = ss.create({
	container: {
		marginBottom: size(15),
	},
	field: {
		position: 'relative',
		borderColor: ss.constants.COLOR_CORE_PRIMARY,
		paddingBottom: 1,
		borderBottomWidth: 1,
		paddingTop: size(10),
	},
	input: {
		...p,
		height: HEIGHT_INPUT,
		paddingTop: 5,
		paddingBottom: 5,
		paddingHorizontal: 0, // NOTE Android only
		backgroundColor: 'transparent',
	},
	active: {
		paddingBottom: 0,
		borderBottomWidth: 2,
	},
	error: {
		color: ss.constants.COLOR_ACCENT_RED,
		opacity: 1,
	},
	eye: {
		justifyContent: 'center',
		paddingTop: size(10),
		position: 'absolute',
		top: 2,
		right: 0,
		bottom: 0,
	},
	pSmall: {
		...p,
		fontSize: size(12),
		opacity: 0.85,
		marginTop: 5,
	},
})

export default TextField
