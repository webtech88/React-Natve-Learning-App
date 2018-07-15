import React, { Component } from 'react'

import { connect } from 'react-redux'

import ProfileActions from '../actions/creator'
import ProfileReferenceForm from '../components/profile-reference-form'


class ProfileReferenceFormScreen extends Component {

	render() {
		const {
			attempting,
			firstName,
			gender,
			cloudinaryPublicId,
			initialValues,
			activeField,
			addProfileReference,
		} = this.props

		return (
			<ProfileReferenceForm
				attempting={attempting}
				firstName={firstName}
				gender={gender}
				cloudinaryPublicId={cloudinaryPublicId}
				initialValues={initialValues}
				activeField={activeField}
				onSubmit={addProfileReference}
			/>
		)
	}

}


// Redux mappings
const mapStateToProps = (state) => {
	const { connectionProfile: profile } = state.profile
	const { profileReferenceForm } = state.form

	return {
		attempting: profile.submittingReference,
		firstName: profile.data.first_name,
		gender: profile.data.gender,
		cloudinaryPublicId: profile.data.cloudinary_file_id,
		initialValues: {
			receiver_id: profile.data.member_id,
		},
		activeField: profileReferenceForm && profileReferenceForm.active,
		errors: profile.errors,
	}
}

const mapDispatchToProps = dispatch => ({
	addProfileReference: (values, func, form) => {
		if (form && form.valid) {
			dispatch(ProfileActions.addProfileReferenceAttempt(values.receiver_id, values.reference))
		}
	},
})

export default connect(mapStateToProps, mapDispatchToProps)(ProfileReferenceFormScreen)
