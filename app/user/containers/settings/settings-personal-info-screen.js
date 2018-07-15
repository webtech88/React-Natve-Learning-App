import React, { Component } from 'react'

import { Actions as NavigationActions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import { getFormValues, isValid, actionTypes as ReduxFormActions } from 'redux-form'

import UserActions from '../../actions/creator'
import common from '../../../common'
import SettingsFormPersonalInfo from '../../components/settings/settings-form-personal-info'

const { NavBarSaveButton } = common.components.navigation
const { MediaUploader } = common.util

class SettingsPersonalInfoScreen extends Component {
	state = {
		canUpdate: false,
		values: this.props.initialValues,
		uploading: false,
	}

	componentDidMount() {
		this.refreshNavBarSaveButton(false, false)
	}

	componentWillReceiveProps(nextProps) {
		const { initialValues } = this.props
		const { updatedValues, isFormValid } = nextProps

		// has form values changed?
		let canUpdate = false
		Object.entries(updatedValues).forEach(([key, value]) => {
			const val = value ? value.toString() : ''
			const initialVal = initialValues[key] ? initialValues[key].toString() : ''
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
			this.refreshNavBarSaveButton(!!canUpdate, !!nextProps.attempting)
		}

		// show loading in navbar instead of save button
		if (this.props.attempting !== nextProps.attempting) {
			this.refreshNavBarSaveButton(!!canUpdate, !!nextProps.attempting)
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
		const { userId, onUpdateSettingsAttempt, initialValues } = this.props
		const { values } = this.state

		if (initialValues.cloudinary_file_id !== values.cloudinary_file_id) {
			this.setState({ uploading: true })
			MediaUploader.upload(this.state.values.cloudinary_file_id, userId)
				.then((response) => {
					const updatedValues = { ...this.state.values, cloudinary_file_id: response.cloudId }
					onUpdateSettingsAttempt(userId, updatedValues)
					this.setState({ uploading: false })
				})
				.catch(() => this.setState({ uploading: false }))
		} else {
			onUpdateSettingsAttempt(userId, values)
		}
	}

	refreshNavBarSaveButton = (active, attempting) => {
		const { userId, onUpdateSettingsAttempt } = this.props

		NavigationActions.refresh({
			key: this.props.sceneKey,
			renderRightButton: () =>
				(<NavBarSaveButton
					active={active}
					attempting={attempting}
					onPress={this.handleSubmit}
				/>),
		})
	}

	render() {
		const {
			attempting,
			errors,
			initialValues,
			activeField,
			onFocus,
			onBlur,
			userId,
		} = this.props

		return (
			<SettingsFormPersonalInfo
				attempting={attempting}
				errors={errors}
				initialValues={initialValues}
				activeField={activeField}
				onFocus={onFocus}
				onBlur={onBlur}
				userId={userId}
			/>
		)
	}
}


// Redux mappings
const mapStateToProps = (state) => {
	const { data: user } = state.user
	const { settingsFormPersonalInfo } = state.form

	return {
		attempting: state.user.updatingUser,
		isFormValid: isValid('settingsFormPersonalInfo')(state),
		userId: user.member_id,
		initialValues: {
			first_name: user.first_name,
			last_name: user.last_name,
			// location: user.location,
			date_of_birth: user.date_of_birth,
			personal_statement: user.personal_statement,
			gender: user.gender && user.gender.toString(),
			cloudinary_file_id: user.cloudinary_file_id,
		},
		updatedValues: getFormValues('settingsFormPersonalInfo')(state),
		activeField: settingsFormPersonalInfo && settingsFormPersonalInfo.active,
		errors: state.user.errors,
	}
}

const mapDispatchToProps = dispatch => ({
	onUpdateSettingsAttempt: (userId, user) => {
		dispatch(UserActions.updateUserAttempt(userId, user))
	},
	onFocus: (field) => {
		dispatch({
			type: ReduxFormActions.FOCUS,
			meta: {
				form: 'settingsFormPersonalInfo',
				field,
			},
		})
	},
	onBlur: (field) => {
		dispatch({
			type: ReduxFormActions.BLUR,
			meta: {
				form: 'settingsFormPersonalInfo',
				field,
				touch: true,
			},
		})
	},
})

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPersonalInfoScreen)
