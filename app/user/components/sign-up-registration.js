import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
	View,
	TouchableOpacity,
	DatePickerAndroid,
	Platform,
} from 'react-native'

import moment from 'moment-timezone'

import { Field, reduxForm } from 'redux-form'
import ss from '../../styles'
import common from '../../common'

const { Button, HeaderIcon, TransText } = common.components.core
const { Form, TextField, DatePicker } = common.components.form
const { FormUtil } = common.util

class SignUpRegistration extends Component {
	state = {
		date: new Date(),
		keyboardIsOpen: false,
		datePickerIsOpen: false,
		shouldAvoidDatePicker: false,
	}

	// componentWillUpdate(nextProps, nextState) {
	// 	console.log('will update', nextState.keyboardIsOpen, nextState.datePickerIsOpen);
	// }

	handleFocusNext = (field) => {
		const { name } = field.props

		if (name === 'date_of_birth') {
			this.handleFocusDatePicker()
		} else {
			const input = field.getRenderedComponent().refs[name]

			if (input) {
				input.focus()
			}
		}
	}

	handleFocusDatePicker = () => {
		if (Platform.OS === 'android') {
			DatePickerAndroid.open({
				date: moment(this.state.date).toDate(),
				maximumDate: new Date(),
			}).then((r) => {
				if (r.action !== DatePickerAndroid.dateSetAction) {
					return
				}
				this.handleDateChange(moment([r.year, r.month, r.day]))
			})
		}
		// TODO manual redux form FOCUS & BLUR ???
		this.setState({ shouldAvoidDatePicker: !this.state.shouldAvoidDatePicker })
	}

	handleDateChange = (date) => {
		this.props.change('date_of_birth', moment(date).format('YYYY-MM-DD'))
		this.setState({ date })
	}

	handleFormStateChange = (state) => {
		this.setState({
			keyboardIsOpen: state.keyboardIsOpen,
			datePickerIsOpen: state.datePickerIsOpen,
			shouldAvoidDatePicker: state.datePickerIsOpen,
		})
	}

	render() {
		const {
			anyTouched, valid, handleSubmit,
			attempting,
			onSignUpRegistration,
		} = this.props
		// const canAttempt = !attempting && valid
		const canAttempt = !attempting && anyTouched && valid

		return (
			<View style={styles.wrapper}>
				<Form
					ref={(c) => { this.form = c }}
					style={styles.container}
					shouldAvoidDatePicker={this.state.shouldAvoidDatePicker}
					onStateChange={this.handleFormStateChange}
				>

					<View style={styles.header}>
						{(!this.state.keyboardIsOpen
							&& !this.state.datePickerIsOpen)
							//&& <HeaderIcon icon={ss.images.iconHeaderBadge} iconWidth={80} iconHeight={79} />
							&& <HeaderIcon name="badges" size={size(40)} />
						}
						<View style={styles.info}>
							<TransText style={styles.h1} transkey="ENTER_REGISTRATION_NUMBER" />
							{(!this.state.keyboardIsOpen
								&& !this.state.datePickerIsOpen)
								&& <TransText style={styles.pLight} transkey="NUMBER_FROM_PROVIDER" />
							}
						</View>
					</View>

					<View style={styles.form}>
						<Field
							ref={(c) => { this.registration_number = c }}
							withRef
							name="registration_number"
							label="Registration Number"
							component={TextField}
							keyboardType="default"
							returnKeyType="next"
							autoCorrect={false}
							autoCapitalize="characters"
							editable={!attempting}
							disabled={attempting}
							onSubmitEditing={() => (Platform.OS === 'ios'
								? this.handleFocusNext(this.date_of_birth)
								: null)
							}
						/>
						<TouchableOpacity activeOpacity={1} onPress={this.handleFocusDatePicker}>
							<Field
								ref={(c) => { this.date_of_birth = c }}
								withRef
								name="date_of_birth"
								label="Date of Birth"
								component={TextField}
								keyboardType="default"
								autoCorrect={false}
								editable={false}
								disabled={attempting}
								format={value => (value ? moment(value).format('D MMMM YYYY') : '')}
								meta={{ active: this.state.datePickerIsOpen }}
							/>
						</TouchableOpacity>
						<Button
							style={{ marginTop: size(20), marginBottom: size(10) }}
							label="Next"
							isLoading={attempting}
							disabled={!canAttempt}
							onPress={handleSubmit(onSignUpRegistration)}
						/>
						<View>
							<Text style={styles.p}>Don‘t have a Pearson registration number?</Text>
							<Text style={styles.p}>Contact your employer or training provider.</Text>
						</View>
					</View>

					{this.state.datePickerIsOpen && <DatePicker
						date={this.state.date}
						maximumDate={new Date()}
						onDateChange={this.handleDateChange}
					/>}

				</Form>
			</View>
		)
	}

}

SignUpRegistration.propTypes = {
	anyTouched: PropTypes.bool.isRequired,
	valid: PropTypes.bool.isRequired,
	handleSubmit: PropTypes.func.isRequired,
	change: PropTypes.func.isRequired,
	attempting: PropTypes.bool.isRequired,
	onSignUpRegistration: PropTypes.func.isRequired,
}

// StyleSheet
const {
	size,
	base: { wrapper },
	typo: { h1, p, pLight },
} = ss

const styles = ss.create({
	wrapper: {
		...wrapper,
		// backgroundColor: 'gray', // NOTE testing flexbox
		paddingTop: ss.constants.HEIGHT_STATUS_BAR,
	},
	container: {
		// backgroundColor: 'red', // NOTE testing flexbox
		justifyContent: 'space-between',
		paddingHorizontal: size(30),
	},
	header: {
		// backgroundColor: 'pink', // NOTE testing flexbox
		paddingVertical: size(20),
	},
	info: {
		backgroundColor: 'white',
		// backgroundColor: 'red', // NOTE testing flexbox
		paddingVertical: size(10),
	},
	form: {
		backgroundColor: 'white',
		// backgroundColor: 'gray', // NOTE testing flexbox
		flex: 1,
		justifyContent: 'center',
		paddingBottom: size(20),
	},
	h1: {
		...h1,
		textAlign: 'center',
		marginBottom: size(10),
	},
	p: {
		...p,
		fontSize: size(12),
		opacity: 0.7,
	},
	pLight: {
		...pLight,
		fontSize: size(18),
		textAlign: 'center',
	},
})


const validate = (values, props) => {
	const { errors: apiErrors } = props
	const errors = {}

	// local validation
	FormUtil.validate(values, errors, 'registration_number').required()
	FormUtil.validate(values, errors, 'date_of_birth').required()

	// api validation
	if (apiErrors && apiErrors.registration_number) errors.registration_number = apiErrors.registration_number
	if (apiErrors && apiErrors.date_of_birth) errors.date_of_birth = apiErrors.date_of_birth

	return errors
}

const SignUpRegistrationComponent = reduxForm({
	form: 'signUpRegistrationForm',
	destroyOnUnmount: true,
	shouldValidate: () => true,
	validate,
})(SignUpRegistration)

export default SignUpRegistrationComponent
