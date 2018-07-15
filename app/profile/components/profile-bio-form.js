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

import ss from '../../styles'
import common from '../../common'

const { Form, TextField, DatePicker } = common.components.form
const { FormUtil, ImagePicker } = common.util
const { Button, CloudinaryImage, Icon } = common.components.core


class ProfileBioForm extends Component {
	// TODO BUG on date fields
	// manual redux form focus/blur does not trigger sync error update

	// NOTE
	// form shared between Experience and Education, so...
	// need subtitle label prop, ok?
	constructor(props) {
		super(props)

		const fromDate = (this.props.initialValues && this.props.initialValues.from_date)
		const toDate = (this.props.initialValues && this.props.initialValues.to_date)

		this.state = {
			fromDate: fromDate && new Date(toDate),
			toDate: toDate && new Date(toDate),
			focusedDateField: null,
			activeHandle: null,
			datePickerIsOpen: false,
			shouldAvoidDatePicker: false,
			isUploading: false,
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

	onEditPhotoPress = () => {
		const { userId, change } = this.props

		ImagePicker.showImagePicker().then((photo) => {
			if (photo.uri) {
				this.setState({ localUri: photo.localUri })
				change('cloudinary_file_id', photo.uri)
			}
		}).catch(() => this.setState({ isUploading: false }))
	}

	handleFocusNext = (field) => {
		if (field) {
			const { name } = field.props

			if (name === 'from_date' || name === 'to_date') {
				this.handleFocusDatePicker(name)
			} else {
				const input = field.getRenderedComponent().refs[name]

				if (input) {
					// TODO BUG form state updates to hide both keybaord and datepicker and only then focuses next field
					input.focus()
				}
			}
		}
	}

	handleFocusDatePicker = (ref) => {
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
			this.props.onFocus(ref)
		} else {
			this.props.onBlur(ref)
		}

		this.setState({
			focusedDateField: ref,
			shouldAvoidDatePicker: !this.state.shouldAvoidDatePicker,
		})
	}

	handleDateChange = (date) => {
		this.props.change(this.state.focusedDateField, moment(date).format('YYYY-MM-DD'))
		this.state.focusedDateField === 'from_date'
			? this.setState({ fromDate: date })
			: this.setState({ toDate: date })
	}

	handleFormStateChange = (state) => {
		this.setState({
			datePickerIsOpen: state.datePickerIsOpen,
			shouldAvoidDatePicker: state.datePickerIsOpen,
		})
	}

	render() {
		const { subtitleLabel, attempting, initialValues, onDelete } = this.props
		const { focusedDateField, fromDate, toDate, localUri } = this.state
		const { cloudinary_file_id } = initialValues
		const photoDimensions = size(100)
		let datePickerProps

		if (focusedDateField === 'from_date' && fromDate) {
			datePickerProps = { ...datePickerProps, date: fromDate }
		} else if (focusedDateField === 'to_date' && toDate) {
			datePickerProps = { ...datePickerProps, date: toDate }
		}

		return (
			<View style={styles.wrapper}>
				<Form
					style={styles.container}
					behaviour="scroll"
					shouldAvoidDatePicker={this.state.shouldAvoidDatePicker}
					activeHandle={this.state.activeHandle}
					onStateChange={this.handleFormStateChange}
				>
					<View style={styles.photo}>
						<CloudinaryImage
							style={{ backgroundColor: ss.constants.COLOR_CORE_SECONDARY }}
							publicId={localUri ? null : cloudinary_file_id}
							isLoading={this.state.isUploading}
							placeholder={(localUri
								? { uri: localUri }
								: ss.images.avatarImage // TODO: Create icon
							)}
							placeholderResizeMode={localUri ? 'cover' : 'contain'}
							placeholderSize={localUri ? photoDimensions : size(50)}
							width={photoDimensions}
							height={photoDimensions}
							options="cover"
						/>
						<TouchableOpacity
							style={styles.iconEdit}
							underlayColor="white"
							activeOpacity={0.8}
							onPress={this.onEditPhotoPress}
						>
							<Icon name="edit" />
						</TouchableOpacity>
					</View>
					<View ref={(c) => { this.Field_title = c }}>
						<Field
							ref={(c) => { this.title = c }}
							withRef
							name="title"
							label="Title"
							component={TextField}
							keyboardType="default"
							returnKeyType="next"
							autoCorrect={false}
							editable={!attempting}
							disabled={attempting}
							onSubmitEditing={() => this.handleFocusNext(this.subtitle)}
						/>
					</View>
					<View ref={(c) => { this.Field_subtitle = c }}>
						<Field
							ref={(c) => { this.subtitle = c }}
							withRef
							name="subtitle"
							label={subtitleLabel}
							component={TextField}
							keyboardType="default"
							returnKeyType="next"
							autoCorrect={false}
							editable={!attempting}
							disabled={attempting}
							onSubmitEditing={() => this.handleFocusNext(this.description)}
						/>
					</View>
					<View ref={(c) => { this.Field_description = c }}>
						<Field
							ref={(c) => { this.description = c }}
							withRef
							name="description"
							label="Description"
							component={TextField}
							keyboardType="default"
							autoCorrect={false}
							editable={!attempting}
							disabled={attempting}
							multiline
						/>
					</View>
					<View ref={(c) => { this.Field_location = c }}>
						<Field
							ref={(c) => { this.location = c }}
							withRef
							name="location"
							label="Location"
							component={TextField}
							keyboardType="default"
							returnKeyType="next"
							autoCorrect={false}
							editable={!attempting}
							disabled={attempting}
							onSubmitEditing={() => (Platform.OS === 'ios'
								? this.handleFocusNext(this.from_date)
								: null)
							}
						/>
					</View>
					<View ref={(c) => { this.Field_from_date = c }}>
						<TouchableOpacity activeOpacity={1} onPress={() => this.handleFocusDatePicker('from_date')}>
							<Field
								ref={(c) => { this.from_date = c }}
								withRef
								name="from_date"
								label="From"
								component={TextField}
								keyboardType="default"
								autoCorrect={false}
								editable={false}
								disabled={attempting}
								format={value => (value ? moment(value).format('D MMMM YYYY') : '')}
								meta={{
									active: this.state.datePickerIsOpen &&
										this.state.focusedDateField === 'from_date',
								}}
							/>
						</TouchableOpacity>
					</View>
					<View ref={(c) => { this.Field_to_date = c }}>
						<TouchableOpacity activeOpacity={1} onPress={() => this.handleFocusDatePicker('to_date')}>
							<Field
								ref={(c) => { this.to_date = c }}
								withRef
								name="to_date"
								label="To"
								component={TextField}
								keyboardType="default"
								autoCorrect={false}
								editable={false}
								disabled={attempting}
								format={value => (value ? moment(value).format('D MMMM YYYY') : '')}
								meta={{
									active: this.state.datePickerIsOpen &&
										this.state.focusedDateField === 'to_date',
								}}
							/>
						</TouchableOpacity>
					</View>
					{initialValues.member_bio_id &&
						<Button
							style={styles.button}
							type="outline"
							color={ss.constants.COLOR_ACCENT_RED}
							height={ss.constants.HEIGHT_BUTTON_SMALL}
							label="Delete"
							onPress={onDelete}
						/>
					}
				</Form>
				{this.state.datePickerIsOpen &&
					<DatePicker
						maximumDate={new Date()}
						onDateChange={this.handleDateChange}
						{...datePickerProps}
					/>
				}
			</View>
		)
	}

}

ProfileBioForm.propTypes = {
	subtitleLabel: PropTypes.string.isRequired,
	initialValues: PropTypes.object.isRequired,
	attempting: PropTypes.bool.isRequired,
	onDelete: PropTypes.func,
	userId: PropTypes.number.isRequired,
}

ProfileBioForm.defaultProps = {
	onDelete: () => null,
}


// StyleSheet
const {
	size,
	base: { wrapper },
} = ss

const styles = ss.create({
	wrapper: {
		...wrapper,
		paddingTop: 0,
		// backgroundColor: 'lightgreen'
	},
	container: {
		// backgroundColor: 'pink', // NOTE testing flexbox
		paddingHorizontal: size(20),
		paddingVertical: size(30),
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
		borderRadius: 22,
		borderColor: 'rgba(0, 0, 0, .1)',
		borderWidth: 1,
		shadowColor: 'black',
		shadowOffset: {
			height: 2,
			width: 0,
		},
		shadowOpacity: 0.1,
		shadowRadius: size(10),
		elevation: 5,
		marginTop: -size(25),
		marginLeft: size(80),
	},
	icon: {
		flex: 1,
		width: size(22),
		height: size(22),
	},
	button: {
		alignSelf: 'center',
		width: size(130),
		marginTop: size(30),
		marginBottom: size(20),
	},
})


// Form
const validate = (values, props) => {
	const { errors: apiErrors } = props
	const errors = {}

	// local validation
	FormUtil.validate(values, errors, 'title').required()
	FormUtil.validate(values, errors, 'subtitle').required()
	FormUtil.validate(values, errors, 'description').required()
	FormUtil.validate(values, errors, 'location').required()
	FormUtil.validate(values, errors, 'from_date').required()

	// api validation
	if (apiErrors && apiErrors.title) errors.title = apiErrors.title
	if (apiErrors && apiErrors.subtitle) errors.subtitle = apiErrors.subtitle
	if (apiErrors && apiErrors.description) errors.description = apiErrors.description
	if (apiErrors && apiErrors.location) errors.location = apiErrors.location
	if (apiErrors && apiErrors.from_date) errors.from_date = apiErrors.from_date
	if (apiErrors && apiErrors.to_date) errors.to_date = apiErrors.to_date

	return errors
}

const ProfileBioFormComponent = reduxForm({
	form: 'profileBioForm',
	destroyOnUnmount: true,
	shouldValidate: () => true,
	validate,
})(ProfileBioForm)

export default ProfileBioFormComponent
