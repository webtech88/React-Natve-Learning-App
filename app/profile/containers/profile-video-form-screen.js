import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
	Alert,
	View,
} from 'react-native'

import { Actions as NavigationActions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import { getFormValues } from 'redux-form'
import ProfileActions from '../actions/creator'

import ss from '../../styles'
import common from '../../common'
import ProfileVideoForm from '../components/profile-video-form'
import lang from '../../core/config/lang'

const { BackButton } = common.components.navigation
const { MediaUploader } = common.util
const { getText } = lang

class ProfileVideoFormScreen extends Component {

	state = {
		uploading: false,
	}

	onBack = () => {
		const { initialValues, updatedValues } = this.props

		// has form values changed?
		let formHasChanged = false
		Object.entries(updatedValues).forEach(([key, value]) => {
			const val = value ? value.toString() : ''
			const initialVal = initialValues[key] ? initialValues[key].toString() : ''
			if (!formHasChanged && val !== initialVal) {
				formHasChanged = true
			}
		})

		if (formHasChanged) {
			Alert.alert(
				getText('Discard changes?'),
				getText('Press Cancel to continue open'),
				[
					{ text: getText('Cancel'), style: 'cancel' },
					{ text: getText('Yes'), onPress: () => NavigationActions.pop() },
				],
			)
		} else {
			NavigationActions.pop()
		}
	}

	/**
	 * On form submit we replace the localUri with a real cloudinary_file_id that we get after upload finishes
	 */
	handleSubmit = (values, func, form) => {
		const { userId, submitProfileVideo, initialValues } = this.props

		if (initialValues.cloudinary_file_id !== values.cloudinary_file_id) {
			this.setState({ uploading: true })
			MediaUploader.upload(values.cloudinary_file_id, userId)
				.then((response) => {
					const updatedValues = { ...values, cloudinary_file_id: response.cloudId }
					submitProfileVideo(updatedValues, func, form)
					this.setState({ uploading: false })
				})
				.catch(() => this.setState({ uploading: false }))
		} else {
			submitProfileVideo(values, func, form)
		}
	}

	render() {
		const {
			userId,
			mediaId,
			attempting,
			initialValues,
			activeField,
			errors,
			deleteProfileVideo,
		} = this.props

		return (
			<View style={styles.wrapper}>
				<BackButton name="hide" onPress={this.onBack} />
				<ProfileVideoForm
					userId={userId}
					mediaId={mediaId}
					attempting={attempting || this.state.uploading}
					initialValues={initialValues}
					activeField={activeField}
					errors={errors}
					onSubmit={this.handleSubmit}
					onDelete={deleteProfileVideo}
				/>
			</View>
		)
	}

}

ProfileVideoFormScreen.propTypes = {
	userId: PropTypes.number.isRequired,
	mediaId: PropTypes.number.isRequired,
	attempting: PropTypes.bool.isRequired,
	initialValues: PropTypes.shape({
		cloudinary_file_id: PropTypes.string,
		title: PropTypes.string,
		description: PropTypes.string,
		is_public: PropTypes.string,
	}).isRequired,
	activeField: PropTypes.string,
	errors: PropTypes.object,
	submitProfileVideo: PropTypes.func.isRequired,
	deleteProfileVideo: PropTypes.func.isRequired,
}

ProfileVideoFormScreen.defaultProps = {
	activeField: null,
	errors: null,
}


// StyleSheet
const {
	base: { wrapper },
} = ss

const styles = ss.create({
	wrapper: {
		...wrapper,
		// backgroundColor: 'pink', // NOTE testing flexbox
		paddingTop: 0,
	},
})


// Redux mappings
const mapStateToProps = (state) => {
	const { profile } = state
	const { video, submittingVideo, deletingVideo, errors } = profile
	const { profileVideoForm } = state.form

	return {
		userId: state.user.data.member_id,
		mediaId: (video && video.media_id) || 0,
		attempting: !!(submittingVideo + deletingVideo),
		initialValues: {
			cloudinary_file_id: (video && video.cloudinary_file_id) || null,
			title: (video && video.title.toString()) || '',
			description: (video && video.description.toString()) || '',
			is_public: (video && video.is_public.toString()) || '1',
			tags: (video && video.tags) || null,
		},
		updatedValues: getFormValues('profileVideoForm')(state),
		activeField: profileVideoForm && profileVideoForm.active,
		errors,
		locale: state.app.locale
	}
}

function mergeProps(stateProps, dispatchProps, ownProps) {
	const { dispatch } = dispatchProps
	const { mediaId } = stateProps

	return {
		...ownProps,
		...stateProps,
		submitProfileVideo: (values, func, form) => {
			if (form && form.valid) {
				dispatch(ProfileActions.submitProfileVideoAttempt(mediaId, values))
			}
		},
		deleteProfileVideo: () => {
			dispatch(ProfileActions.deleteProfileVideoAttempt(mediaId))
		},
	}
}

export default connect(mapStateToProps, null, mergeProps)(ProfileVideoFormScreen)
