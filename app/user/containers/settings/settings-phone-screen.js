import React, { Component } from 'react'

import { Actions as NavigationActions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import { getFormValues, isValid } from 'redux-form'

import common from '../../../common'
import UserActions from '../../actions/creator'
import SettingsFormPhone from '../../components/settings/settings-form-phone'

const { NavBarSaveButton } = common.components.navigation


class SettingsPhoneScreen extends Component {

	state = {
		canUpdate: false,
		values: this.props.initialValues,
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

	refreshNavBarSaveButton = (active, attempting) => {
		const { member_id, onUpdateSettingsAttempt } = this.props

		NavigationActions.refresh({
			key: this.props.sceneKey,
			renderRightButton: () =>
				(<NavBarSaveButton
					active={active}
					attempting={attempting}
					onPress={() => onUpdateSettingsAttempt(member_id, this.state.values)}
				/>),
		})
	}

	render() {
		const { attempting, initialValues } = this.props

		return (
			<SettingsFormPhone
				attempting={attempting}
				initialValues={initialValues}
			/>
		)
	}
}


// Redux mappings
const mapStateToProps = (state) => {
	const { data: user } = state.user

	return {
		attempting: state.user.updatingUser,
		isFormValid: isValid('settingsFormPhone')(state),
		member_id: user.member_id,
		initialValues: {
			uk_mobile_number: user.uk_mobile_number,
		},
		updatedValues: getFormValues('settingsFormPhone')(state),
	}
}

const mapDispatchToProps = dispatch => ({
	onUpdateSettingsAttempt: (member_id, user) => {
		dispatch(UserActions.updateUserAttempt(member_id, user))
	},
})

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPhoneScreen)
