import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
	View,
	Keyboard,
} from 'react-native'

import { Actions as NavigationActions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import { getFormValues, isValid, actionTypes as ReduxFormActions } from 'redux-form'

import ProfileActions from '../actions/creator'
import common from '../../common'
import ProfileBioForm from '../components/profile-bio-form'

import ss from '../../styles'

const { NavBar, NavBarIconButton, NavBarSaveButton } = common.components.navigation
const { MediaUploader } = common.util

class ProfileBioFormScreen extends Component {

	state = {
		canUpdate: false,
		attempting: false,
		uploading: false,
		values: this.props.initialValues,
		localUri: null,
	}

	componentWillReceiveProps(nextProps) {
		const { initialValues } = this.props
		const { updatedValues, isFormValid } = nextProps

		// has form values changed?
		let canUpdate = false
		Object.entries(updatedValues).forEach(([key, value]) => {
			const val = value || ''
			const initialVal = initialValues[key] ? initialValues[key] : ''

			if (!canUpdate && val !== initialVal) {
				canUpdate = true
			}
		})

		// disallow update if redux form not valid
		if (canUpdate && !isFormValid) canUpdate = false

		// update state if form changed
		if (canUpdate) {
			this.setState({ values: updatedValues })
		}

		// enable/disable navbar save button
		if (canUpdate !== this.state.canUpdate) {
			this.setState({ canUpdate })
		}

		// show loading in navbar instead of save button
		if (this.props.attempting !== nextProps.attempting) {
			this.setState({ attempting: !!nextProps.attempting })
		}
	}

	componentWillUpdate(nextProps, nextState) {
		if (this.state.uploading !== nextState.uploading) {
			this.refreshNavBarSaveButton(nextState.canUpdate, nextState.uploading)
		}
	}

	/**
	 * On form submit we replace the localUri with a real cloudinary_file_id that we get after upload finishes
	 */
	handleSubmit = () => {
		const { userId, onSubmitProfileBioAttempt, initialValues } = this.props
		const { values } = this.state

		if (initialValues.cloudinary_file_id !== values.cloudinary_file_id) {
			this.setState({ uploading: true })
			MediaUploader.upload(this.state.values.cloudinary_file_id, userId)
				.then((response) => {
					const updatedValues = { ...this.state.values, cloudinary_file_id: response.cloudId }
					onSubmitProfileBioAttempt(userId, updatedValues)
					this.setState({ uploading: false })
				})
				.catch(() => this.setState({ uploading: false }))
		} else {
			onSubmitProfileBioAttempt(userId, values)
		}
	}

	render() {
		const {
			userId,
			initialValues,
			errors,
			activeField,
			onFocus,
			onBlur,
			backButtonImage,
			onSubmitProfileBioAttempt,
			onDeleteProfileBioAttempt,
		} = this.props
		const { canUpdate, attempting, values } = this.state

		return (
			<View style={styles.wrapper}>
				<NavBar
					title={this.props.title}
					navigationBarStyle={{ borderBottomWidth: 1 }}
					renderLeftButton={() => (
						<NavBarIconButton name="back"
							onPress={() => {
								Keyboard.dismiss()
								NavigationActions.pop()
							}}
						/>
					)}
					// leftButtonImage={backButtonImage}
					// onLeft={() => {
					// 	Keyboard.dismiss()
					// 	NavigationActions.pop()
					// }}
					renderRightButton={() => (
						<NavBarSaveButton
							active={canUpdate}
							attempting={attempting}
							onPress={() => onSubmitProfileBioAttempt(userId, values)}
						/>
					)}
				/>
				<ProfileBioForm
					subtitleLabel="Company"
					initialValues={initialValues}
					attempting={attempting}
					errors={errors}
					onDelete={() => onDeleteProfileBioAttempt(userId, initialValues)}
					activeField={activeField}
					onFocus={onFocus}
					onBlur={onBlur}
					userId={userId}
				/>
			</View>
		)
	}

}

ProfileBioFormScreen.propTypes = {
	initialValues: PropTypes.object.isRequired,
}


// StyleSheet
const {
	base: { wrapper },
} = ss

const styles = ss.create({
	wrapper: {
		...wrapper,
		// backgroundColor: 'red', // NOTE testing flexbox
	},
})


// Redux mappings
const mapStateToProps = (state) => {
	const { profile } = state
	const { profileBioForm } = state.form

	return {
		userId: state.user.data.member_id,
		attempting: profile.submittingBio,
		updatedValues: getFormValues('profileBioForm')(state),
		isFormValid: isValid('profileBioForm')(state),
		activeField: profileBioForm && profileBioForm.active,
		errors: profile.errors,
	}
}

const mapDispatchToProps = dispatch => ({
	onSubmitProfileBioAttempt: (member_id, bio) => {
		const { member_bio_id } = bio

		if (member_bio_id) {
			// Update
			dispatch(ProfileActions.updateProfileBioAttempt(member_id, bio))
		} else {
			// Add
			delete bio.member_bio_id
			dispatch(ProfileActions.addProfileBioAttempt(member_id, bio))
		}
	},
	onDeleteProfileBioAttempt: (member_id, bio) => {
		const { member_bio_id } = bio

		if (member_bio_id) {
			// Delete
			dispatch(ProfileActions.deleteProfileBioAttempt(member_id, bio))
		}
	},
	onFocus: (field) => {
		dispatch({
			type: ReduxFormActions.FOCUS,
			meta: {
				form: 'profileBioForm',
				field,
			},
		})
	},
	onBlur: (field) => {
		dispatch({
			type: ReduxFormActions.BLUR,
			meta: {
				form: 'profileBioForm',
				field,
				touch: true,
			},
		})
	},
})

export default connect(mapStateToProps, mapDispatchToProps)(ProfileBioFormScreen)
