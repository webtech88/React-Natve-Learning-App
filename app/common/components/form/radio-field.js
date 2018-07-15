import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
	View,
	TouchableOpacity,
	Image,
} from 'react-native'

import Label from './label'
import Icon from '../core/icon'
import ss from '../../../styles'
import TransText from '../core/transtext'


class RadioField extends Component {

	render() {
		const {
			input: { value, onChange },
			meta: { active, error, touched, valid },
			label, labelColor, icons, options, notes, required, editable, disabled, ...otherProps
		} = this.props
		const labelError = (!active && error && touched && !valid) ? error : ''
		const Radio = editable ? TouchableOpacity : View

		if (!Object.keys(options).length) return null
		return (
			<View style={[styles.container, (disabled && { opacity: 0.3 })]}>
				<View style={styles.field}>
					<Label
						label={label}
						labelColor={labelColor}
						value={value}
						required={required}
						error={labelError}
						numberOfLines={null}
					/>
					<View style={styles.input}>
						{Object.keys(options).map((name, index) => {
							const first = (index === 0)
							const last = ((index + 1) === Object.keys(options).length)
							const optionStyles = first
								? styles.optionSelectedFirst
								: (last ? styles.optionSelectedLast : styles.optionSelected)

							return (
								<View key={name}>
									<Radio
										style={[styles.option, (value === name && optionStyles)]}
										activeOpacity={0.9}
										onPress={() => onChange(name)}
									>
										<View style={[styles.radio, (value === name && styles.radioSelected)]}>
											{value === name && <View style={styles.radioDot} />}
										</View>
										<TransText style={styles.text} transkey={options[name]} />
										{icons &&
											<Icon name={icons[index]}
												color={ss.constants.COLOR_TINT_DARKER}
												size={24}
											/>
											// <View style={styles.icon}>
											// 	<Image resizeMode="contain" source={icons[index]} />
											// </View>
										}
									</Radio>
									{!last && <View style={styles.separator} />}
								</View>
							)
						})}
					</View>
				</View>
				{notes && <TransText style={styles.pSmall} transkey={notes} />}
			</View>
		)
	}

}

RadioField.propTypes = {
	options: PropTypes.object.isRequired,
}

RadioField.defaultProps = {
	options: {},
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
		paddingTop: size(10),
	},
	input: {
		marginTop: size(10),
		borderColor: 'rgba(0, 48, 87, 0.1)', // TODO need rgba from hex for opacity color helper
		borderWidth: 1,
		borderRadius: 3,
	},
	separator: {
		height: 1,
		backgroundColor: 'rgba(0, 48, 87, 0.1)',
	},
	option: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: size(15),
		paddingHorizontal: size(20),
		position: 'relative',
	},
	optionSelected: {
		backgroundColor: '#F9F9F9', // TODO
	},
	optionSelectedFirst: {
		borderTopLeftRadius: 3,
		borderTopRightRadius: 3,
		backgroundColor: '#F9F9F9', // TODO
	},
	optionSelectedLast: {
		borderBottomLeftRadius: 3,
		borderBottomRightRadius: 3,
		backgroundColor: '#F9F9F9', // TODO
	},
	radio: {
		opacity: 0.3,
		width: size(24),
		height: size(24),
		borderRadius: 12,
		marginRight: 10,
		padding: size(3),
		borderWidth: 1,
		borderColor: ss.constants.COLOR_CORE_PRIMARY,
	},
	radioSelected: {
		opacity: 1,
	},
	radioDot: {
		flex: 1,
		borderRadius: 12,
		backgroundColor: ss.constants.COLOR_CORE_PRIMARY,
	},
	text: {
		...p,
		color: ss.constants.COLOR_HEADING,
		flex: 1,
	},
	icon: {
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 0,
		justifyContent: 'center',
		paddingHorizontal: size(20),
	},
	// TODO need to seperate this so can be used for all fields
	pSmall: {
		...p,
		fontSize: size(12),
		opacity: 0.85,
		marginTop: 5,
	},
})

export default RadioField
