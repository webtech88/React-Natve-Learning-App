import PropTypes from 'prop-types'
import React, { Component } from 'react'

import { connect } from 'react-redux'

import common from '../../../common'

import UserActions from '../../actions/creator'
import SignUpProfile from '../../components/sign-up-profile'

const { MediaUploader } = common.util

class SignUpProfileScreen extends Component {

	state = { uploading: false }

	/**
	 * On form submit we replace the localUri with a real cloudinary_file_id that we get after upload finishes
	 */
	handleSubmit = (values, func, form) => {
		const { userId, registerProfile, initialValues } = this.props

		if (initialValues.cloudinary_file_id !== values.cloudinary_file_id) {
			this.setState({ uploading: true })
			MediaUploader.upload(values.cloudinary_file_id, userId)
				.then((response) => {
					const updatedValues = { ...values, cloudinary_file_id: response.cloudId }
					registerProfile(updatedValues, func, form)
					this.setState({ uploading: false })
				})
				.catch(() => this.setState({ uploading: false }))
		} else {
			registerProfile(values, func, form)
		}
	}

	render() {
		const { userId, attempting, initialValues, activeField, errors } = this.props
		return (
			<SignUpProfile
				userId={userId}
				attempting={attempting || this.state.uploading}
				initialValues={initialValues}
				activeField={activeField}
				onSignUpProfile={this.handleSubmit}
				errors={errors}
			/>
		)
	}
}

SignUpProfileScreen.propTypes = {
	userId: PropTypes.number.isRequired,
	attempting: PropTypes.bool.isRequired,
	initialValues: PropTypes.object,
	activeField: PropTypes.string,
	registerProfile: PropTypes.func.isRequired,
	errors: PropTypes.object,
}

SignUpProfileScreen.defaultProps = {
	initialValues: null,
	activeField: null,
	errors: null,
}


// Redux mappings
const mapStateToProps = (state) => {
	const { data: user } = state.user
	const { signUpProfileForm } = state.form

	return {
		userId: user.member_id,
		attempting: state.user.attemptingRegisterProfile,
		initialValues: {
			member_id: user.member_id,
			registration_number: user.registration_number,
			first_name: user.first_name,
			last_name: user.last_name,
			date_of_birth: user.date_of_birth,
			email: user.email,
			uk_mobile_number: '',
			gender: '',
		},
		activeField: signUpProfileForm && signUpProfileForm.active,
		errors: user.errors,
	}
}

const mapDispatchToProps = dispatch => ({
	registerProfile: (values, func, form) => {
		if (form && form.valid) {
			dispatch(UserActions.registerProfileAttempt(values))
		}
	},
})

export default connect(mapStateToProps, mapDispatchToProps)(SignUpProfileScreen)
