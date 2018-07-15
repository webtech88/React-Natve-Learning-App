import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
	View,
	Image,
	TouchableOpacity,
	findNodeHandle,
} from 'react-native'

import moment from 'moment-timezone'
import { Field, reduxForm } from 'redux-form'

import ss from '../../styles'
import common from '../../common'

const { Button, CloudinaryImage, TransText } = common.components.core
const { Form, TextField, RadioField } = common.components.form
const { ImagePicker, MediaUploader, FormUtil } = common.util


class SignUpProfile extends Component {
	state = {
		activeHandle: null,
		photoCloudId: null,
		isUploading: false,
		localUri: null,
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
		const { change } = this.props

		ImagePicker.showImagePicker().then((photo) => {
			if (photo.uri) {
				this.setState({ localUri: photo.localUri })
				change('cloudinary_file_id', photo.uri)
			}
		}).catch(() => this.setState({ isUploading: false }))
	}

	handleFocusNext = (ref) => {
		const { name } = ref.props

		if (name) {
			const input = ref.getRenderedComponent().refs[name]

			if (input) {
				input.focus()
			}
		}
	}

	render() {
		const {
			anyTouched, valid, handleSubmit,
			attempting,
			onSignUpProfile,
		} = this.props
		const { localUri } = this.state
		const canAttempt = !attempting && anyTouched && valid
		const photoDimensions = size(100)

		return (
			<View style={styles.wrapper}>
				<Form
					style={styles.container}
					behaviour="scroll"
					activeHandle={this.state.activeHandle}
				>
					<TransText style={styles.h1} transkey="COMPLETE_PROFILE" />
					<View style={styles.photo}>
						<CloudinaryImage
							style={{
								backgroundColor: ss.constants.COLOR_CORE_SECONDARY,
							}}
							publicId={localUri ? null : this.state.photoCloudId}
							placeholder={localUri ? { uri: localUri } : 'avatar-male'}
							placeholderSize={localUri ? photoDimensions : size(50)}
							placeholderResizeMode={localUri ? 'cover' : 'contain'}
							width={photoDimensions}
							height={photoDimensions}
							borderRadius={photoDimensions}
							options="profile"
						/>
						<TouchableOpacity
							style={styles.iconEdit}
							underlayColor="white"
							activeOpacity={0.8}
							onPress={() => this.onEditPhotoPress()}
						>
							<Image style={styles.icon} resizeMode="contain" source={ss.images.iconEdit} />
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
							onSubmitEditing={() => this.handleFocusNext(this.uk_mobile_number)}
						/>
					</View>
					<Field
						ref={(c) => { this.date_of_birth = c }}
						withRef
						name="date_of_birth"
						label="Date of Birth"
						component={TextField}
						keyboardType="default"
						autoCorrect={false}
						editable={false}
						disabled
						format={value => (value ? moment(value).format('D MMMM YYYY') : '')}
					/>
					<Field
						ref={(c) => { this.email = c }}
						withRef
						name="email"
						label="Email"
						component={TextField}
						keyboardType="email-address"
						returnKeyType="next"
						autoCapitalize="none"
						editable={false}
						disabled
					/>
					<View ref={(c) => { this.Field_uk_mobile_number = c }}>
						<Field
							ref={(c) => { this.uk_mobile_number = c }}
							withRef
							name="uk_mobile_number"
							label="UK Mobile"
							notes="We only use your number to send news and updates. You can control these messages from the settings menu."
							component={TextField}
							keyboardType="numeric"
							autoCorrect={false}
							returnKeyType="next"
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
					<Button
						style={{ marginTop: size(20) }}
						label="Activate my Account"
						isLoading={attempting}
						disabled={!canAttempt}
						onPress={handleSubmit(onSignUpProfile)}
					/>
				</Form>
			</View>
		)
	}

}

SignUpProfile.propTypes = {
	anyTouched: PropTypes.bool.isRequired,
	valid: PropTypes.bool.isRequired,
	handleSubmit: PropTypes.func.isRequired,
	change: PropTypes.func.isRequired,
	userId: PropTypes.number.isRequired,
	attempting: PropTypes.bool.isRequired,
	initialValues: PropTypes.shape({
		member_id: PropTypes.number,
		registration_number: PropTypes.string,
		first_name: PropTypes.string,
		last_name: PropTypes.string,
		date_of_birth: PropTypes.string,
		email: PropTypes.string,
		uk_mobile_number: PropTypes.string,
		gender: PropTypes.string,
	}).isRequired,
	activeField: PropTypes.string,
	onSignUpProfile: PropTypes.func.isRequired,
}

SignUpProfile.defaultProps = {
	activeField: undefined,
}

// StyleSheet
const {
	size,
	base: { wrapper },
	typo: { h1 },
} = ss

const styles = ss.create({
	wrapper: {
		...wrapper,
		// backgroundColor: 'pink', // NOTE testing flexbox
		paddingTop: ss.constants.HEIGHT_STATUS_BAR,
	},
	container: {
		// backgroundColor: 'red', // NOTE testing flexbox
		paddingHorizontal: size(30),
		paddingTop: size(20),
		paddingBottom: size(30),
	},
	h1: {
		...h1,
		textAlign: 'center',
		marginBottom: size(25),
	},
	photo: {
		alignItems: 'center',
		marginBottom: size(20),
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
		marginTop: size(-25),
		marginLeft: size(80),
	},
	icon: {
		flex: 1,
		width: size(22),
		height: size(22),
	},
})


const validate = (values, props) => {
	const { errors: apiErrors } = props
	const errors = {}

	// local validation
	FormUtil.validate(values, errors, 'first_name').required()
	FormUtil.validate(values, errors, 'last_name').required()
	FormUtil.validate(values, errors, 'date_of_birth').required()
	FormUtil.validate(values, errors, 'email').required().email()
	FormUtil.validate(values, errors, 'uk_mobile_number').required()
	FormUtil.validate(values, errors, 'gender').required()

	// api validation
	if (apiErrors && apiErrors.first_name) errors.first_name = apiErrors.first_name
	if (apiErrors && apiErrors.last_name) errors.last_name = apiErrors.last_name
	if (apiErrors && apiErrors.date_of_birth) errors.date_of_birth = apiErrors.date_of_birth
	if (apiErrors && apiErrors.email) errors.email = apiErrors.email
	if (apiErrors && apiErrors.uk_mobile_number) errors.uk_mobile_number = apiErrors.uk_mobile_number
	if (apiErrors && apiErrors.gender) errors.gender = apiErrors.gender

	return errors
}

const SignUpProfileComponent = reduxForm({
	form: 'signUpProfileForm',
	destroyOnUnmount: true,
	shouldValidate: () => true,
	validate,
})(SignUpProfile)

export default SignUpProfileComponent
