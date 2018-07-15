import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
	View,
	Text,
	Image,
	TouchableOpacity,
	findNodeHandle,
} from 'react-native'

import DismissKeyboard from 'dismissKeyboard'

import { Actions as NavigationActions } from 'react-native-router-flux'
import { Field, reduxForm } from 'redux-form'

import ss from '../../styles'
import common from '../../common'

const { TextFadeSvg } = common.components.svg
const { Button, CloudinaryImage, TransText } = common.components.core
const { Form, TextField } = common.components.form
const { FormUtil } = common.util


class ProfileReferenceForm extends Component {

	constructor(props) {
		super(props)

		this.state = {
			activeHandle: null,
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

	render() {
		const {
			attempting,
			firstName,
			gender,
			cloudinaryPublicId,
			handleSubmit,
			anyTouched,
			valid,
			onSubmit,
		} = this.props
		// const canAttempt = !attempting && anyTouched && valid; // TODO BUG anyTouched remains false if form has only 1 field
		const canAttempt = !attempting && valid
		const photoDimensions = size(100)

		return (
			<View style={styles.wrapper}>
				<View style={styles.navButtonIconCircle}>
					<TouchableOpacity
						style={styles.navButtonIconCircleTouch}
						activeOpacity={0.9}
						onPress={() => {
							DismissKeyboard()
							NavigationActions.pop()
						}}
					>
						<Image style={styles.navButtonIcon} source={ss.images.iconNavHide} />
					</TouchableOpacity>
				</View>
				<TextFadeSvg position="top" />
				<Form
					style={styles.container}
					behaviour="scroll"
					activeHandle={this.state.activeHandle}
				>
					<View style={styles.header}>
						<TransText 
							style={styles.h1} 
							transkeys={['Provide a reference for ', firstName]}
							tindices={[0]}
						/>
						<CloudinaryImage
							style={{
								marginRight: size(15),
								backgroundColor: ss.constants.COLOR_CORE_SECONDARY,
							}}
							publicId={cloudinaryPublicId}
							placeholder={gender === 2 ? 'avatar-female' : 'avatar-male'}
							placeholderSize={size(50)}
							width={photoDimensions}
							height={photoDimensions}
							borderRadius={photoDimensions}
							options="profile"
						/>
					</View>
					<View ref={(c) => { this.Field_reference = c }}>
						<Field
							ref={(c) => { this.reference = c }}
							withRef
							name="reference"
							label="Reference"
							component={TextField}
							keyboardType="default"
							autoCorrect={false}
							multiline
							editable={!attempting}
							disabled={attempting}
						/>
					</View>
					<Button
						style={{ marginTop: size(20) }}
						label="Submit Reference"
						isLoading={attempting}
						disabled={!canAttempt}
						onPress={handleSubmit(onSubmit)}
					/>
				</Form>
			</View>
		)
	}
}

ProfileReferenceForm.propTypes = {
	attempting: PropTypes.bool.isRequired,
	firstName: PropTypes.string.isRequired,
	gender: PropTypes.number.isRequired,
	cloudinaryPublicId: PropTypes.string.isRequired,
	initialValues: PropTypes.shape({
		receiver_id: PropTypes.number.isRequired,
	}).isRequired,
	onSubmit: PropTypes.func.isRequired,
}

// StyleSheet
const {
	size,
	base: { wrapper },
	navBar: { navButtonIconCircle, navButtonIconCircleTouch, navButtonIcon },
	typo: { h1 },
} = ss

const styles = ss.create({
	wrapper: {
		...wrapper,
		paddingTop: 0,
		// backgroundColor: 'pink', // NOTE testing flexbox
	},
	navButtonIconCircle: {
		...navButtonIconCircle,
		position: 'absolute',
		zIndex: 2,
		top: size(10),
		left: size(10),
		shadowOffset: {
			height: 1,
		},
		shadowOpacity: 0.1,
		elevation: 5,
	},
	navButtonIconCircleTouch: {
		...navButtonIconCircleTouch,
	},
	navButtonIcon: {
		...navButtonIcon,
	},
	container: {
		// backgroundColor: 'red', // NOTE testing flexbox
		paddingHorizontal: size(20),
		paddingVertical: size(30),
	},
	header: {
		alignItems: 'center',
		flexDirection: 'row',
		marginVertical: ss.constants.HEIGHT_NAV_BAR,
	},
	h1: {
		...h1,
		flex: 1,
		marginRight: size(20),
	},
})

// Form
const validate = (values, props) => {
	const { errors: apiErrors } = props
	const errors = {}

	// local validation
	FormUtil.validate(values, errors, 'reference').required()

	// api validation
	if (apiErrors && apiErrors.reference) errors.reference = apiErrors.reference

	return errors
}

const ProfileReferenceFormComponent = reduxForm({
	form: 'profileReferenceForm',
	destroyOnUnmount: true,
	shouldValidate: () => true,
	validate,
})(ProfileReferenceForm)

export default ProfileReferenceFormComponent
