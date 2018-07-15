import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
	View,
	TouchableOpacity,
	findNodeHandle,
	Platform,
	DatePickerAndroid,
} from 'react-native'

import moment from 'moment-timezone'
import { Field, reduxForm } from 'redux-form'

import common from '../../../common'
import ss from '../../../styles'

const { CloudinaryImage, Icon } = common.components.core
const { Form, TextField, RadioField, DatePicker } = common.components.form
const { ImagePicker, FormUtil } = common.util

class SettingsFormPersonalInfo extends Component {

	constructor(props) {
		super(props)

		const date = (this.props.initialValues && this.props.initialValues.date_of_birth)

		this.state = {
			date: date && new Date(date),
			activeHandle: null,
			datePickerIsOpen: false,
			shouldAvoidDatePicker: false,
			localUri: null,
		}
	}

	componentWillReceiveProps(nextProps) {
		const { activeField } = nextProps
		// set active field handle for scroll
		if (this.props.activeField !== activeField) {
			const handle = findNodeHandle(this[`Field_${activeField}`])
			this.setState({ activeHandle: handle })
		}
	}

	/**
	 * We set localUri as `cloudinary_file_id` to fake that the form was changes and to pass this value to container
	 */
	onEditPhotoPress = () => {
		const { change } = this.props

		ImagePicker.showImagePicker().then((photo) => {
			if (photo.uri) {
				this.setState({ localUri: photo.localUri })
				change('cloudinary_file_id', photo.uri)
			}
		}).catch(() => {})
	}

	handleFocusNext = (field) => {
		if (field) {
			const { name } = field.props

			if (name === 'date_of_birth') {
				this.handleFocusDatePicker()
			} else {
				const input = field.getRenderedComponent().refs[name]

				if (input) {
					// TODO BUG form state updates to hide both keybaord and datepicker and only then focuses next field
					input.focus()
				}
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
		if (!this.state.shouldAvoidDatePicker) {
			this.props.onFocus('date_of_birth')
		} else {
			this.props.onBlur('date_of_birth')
		}

		this.setState({ shouldAvoidDatePicker: !this.state.shouldAvoidDatePicker })
	}

	handleDateChange = (date) => {
		this.props.change('date_of_birth', moment(date).format('YYYY-MM-DD'))
		this.setState({ date })
	}

	handleFormStateChange = (state) => {
		this.setState({
			datePickerIsOpen: state.datePickerIsOpen,
			shouldAvoidDatePicker: state.datePickerIsOpen,
		})
	}

	render() {
		const { attempting, initialValues } = this.props
		const { localUri, shouldAvoidDatePicker, activeHandle } = this.state
		const { cloudinary_file_id, gender } = initialValues
		const photoDimensions = size(100)

		return (
			<View style={styles.wrapper}>
				<Form
					style={styles.container}
					behaviour="scroll"
					shouldAvoidDatePicker={shouldAvoidDatePicker}
					activeHandle={activeHandle}
					onStateChange={this.handleFormStateChange}
				>
					<View style={styles.photo}>
						<CloudinaryImage
							style={{
								backgroundColor: ss.constants.COLOR_CORE_SECONDARY,
							}}
							publicId={localUri ? null : cloudinary_file_id}
							placeholder={(localUri
								? { uri: localUri }
								: (Number(gender) === 2 ? 'avatar-female' : 'avatar-male')
							)}
							placeholderResizeMode={localUri ? 'cover' : 'contain'}
							placeholderSize={localUri ? photoDimensions : size(50)}
							width={photoDimensions}
							height={photoDimensions}
							borderRadius={photoDimensions}
							options="profile"
						/>
						<TouchableOpacity
							style={styles.iconEdit}
							underlayColor="white"
							activeOpacity={0.8}
							onPress={this.onEditPhotoPress}
						>
							<Icon name="edit" size={size(35)} />
						</TouchableOpacity>
					</View>
					<View ref={(c) => { this.Field_first_name = c }}>
						<Field
							ref={(c) => { this.first_name = c }}
							withRef
							name="first_name"
							label="First Name"
							component={TextField}
							keyboardType="default"
							returnKeyType="next"
							autoCorrect={false}
							editable={!attempting}
							disabled={attempting}
							onSubmitEditing={() => this.handleFocusNext(this.last_name)}
						/>
					</View>
					<View ref={(c) => { this.Field_last_name = c }}>
						<Field
							ref={(c) => { this.last_name = c }}
							withRef
							name="last_name"
							label="Last Name"
							component={TextField}
							keyboardType="default"
							returnKeyType="next"
							autoCorrect={false}
							editable={!attempting}
							disabled={attempting}
							onSubmitEditing={() => (Platform.OS === 'ios'
								? this.handleFocusNext(this.date_of_birth)
								: null)
							}
						/>
					</View>
					<View ref={(c) => { this.Field_date_of_birth = c }}>
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
					</View>
					{/* <View ref="Field_location">
						<Field
							ref="location"
							withRef={true}
							name="location"
							label="Location"
							component={TextField}
							keyboardType="default"
							returnKeyType="next"
							autoCorrect={false}
							editable={!attempting}
							disabled={attempting}
							onSubmitEditing={() => this.handleFocusNext(this.personal_statement)}
						/>
					</View> */}
					<View ref={(c) => { this.Field_personal_statement = c }}>
						<Field
							ref={(c) => { this.personal_statement = c }}
							withRef
							name="personal_statement"
							label="Summary"
							component={TextField}
							keyboardType="default"
							autoCorrect={false}
							multiline
							editable={!attempting}
							disabled={attempting}
						/>
					</View>
					<View ref={(c) => { this.Field_gender = c }}>
						<Field
							ref={(c) => { this.gender = c }}
							withRef
							name="gender"
							label="Gender"
							options={{ 1: 'Male', 2: 'Female' }}
							component={RadioField}
							editable={!attempting}
							disabled={attempting}
						/>
					</View>
				</Form>
				{this.state.datePickerIsOpen && <DatePicker
					date={this.state.date}
					maximumDate={new Date()}
					onDateChange={this.handleDateChange}
				/>}
			</View>
		)
	}

}

SettingsFormPersonalInfo.propTypes = {
	attempting: PropTypes.bool.isRequired,
	initialValues: PropTypes.shape({
		first_name: PropTypes.string,
		last_name: PropTypes.string,
		date_of_birth: PropTypes.string,
		personal_statement: PropTypes.string,
		gender: PropTypes.string,
		cloudinary_file_id: PropTypes.string,
	}).isRequired,
	userId: PropTypes.number.isRequired,
	change: PropTypes.func.isRequired,
	activeField: PropTypes.string,
	onFocus: PropTypes.func.isRequired,
	onBlur: PropTypes.func.isRequired,
}

SettingsFormPersonalInfo.defaultProps = {
	activeField: undefined,
}

// StyleSheet
const {
	size,
	base: { wrapper },
} = ss

const styles = ss.create({
	wrapper: {
		...wrapper,
		// backgroundColor: 'gray', // NOTE testing flexbox
	},
	container: {
		// backgroundColor: 'red', // NOTE testing flexbox
		paddingHorizontal: size(20),
		paddingTop: size(20),
		paddingBottom: size(30),
	},
	photo: {
		alignItems: 'center',
		marginTop: size(20),
		marginBottom: size(30),
	},
	iconEdit: {
		alignItems: 'center',
		justifyContent: 'center',
		width: size(44),
		height: size(44),
		backgroundColor: 'white',
		borderRadius: size(44),
		borderColor: 'rgba(0, 0, 0, .1)',
		borderWidth: 1,
		ios: {
			shadowColor: 'black',
			shadowOffset: {
				height: 2,
				width: 0,
			},
			shadowOpacity: 0.1,
			shadowRadius: size(10),
		},
		android: {
			elevation: 5,
		},
		marginTop: -size(25),
		marginLeft: size(80),
	},
})


const validate = (values, props) => {
	const { errors: apiErrors } = props
	const errors = {}

	// local validation
	FormUtil.validate(values, errors, 'first_name').required()
	FormUtil.validate(values, errors, 'last_name').required()
	FormUtil.validate(values, errors, 'date_of_birth').required()
	FormUtil.validate(values, errors, 'gender').required()

	// api validation
	if (apiErrors && apiErrors.first_name) errors.first_name = apiErrors.first_name
	if (apiErrors && apiErrors.last_name) errors.last_name = apiErrors.last_name
	if (apiErrors && apiErrors.date_of_birth) errors.date_of_birth = apiErrors.date_of_birth
	if (apiErrors && apiErrors.gender) errors.gender = apiErrors.gender

	return errors
}

const SettingsFormPersonalInfoComponent = reduxForm({
	form: 'settingsFormPersonalInfo',
	destroyOnUnmount: true,
	shouldValidate: () => true,
	validate,
})(SettingsFormPersonalInfo)

export default SettingsFormPersonalInfoComponent
