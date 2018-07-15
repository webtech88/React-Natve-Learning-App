import React, { Component } from 'react'
import {
	View,
	Animated,
} from 'react-native'

import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector } from 'redux-form'

import { Actions as NavigationActions } from 'react-native-router-flux'
import WorkbookActions from '../actions/creator'

import ss from '../../styles'
import common from '../../common'

const { RadioField } = common.components.form
const { NavBar, NavBarSaveButton, NavBarIconButton } = common.components.navigation

class IqaWorkbooksSettingsModal extends Component {

	state = {
		canUpdate: false,
		animTransform: new Animated.Value(ss.constants.HEIGHT_DEVICE),
	}

	componentDidMount() {
		this.animateIn()
	}

	componentWillReceiveProps(nextProps) {
		const { settingsSortBy, settingsOrder } = this.props
		const { updatedSettingsSortBy, updatedSettingsOrder } = nextProps

		let canUpdate = false
		if (settingsSortBy !== updatedSettingsSortBy) canUpdate = true
		if (!canUpdate && settingsOrder !== updatedSettingsOrder) canUpdate = true

		this.setState({ canUpdate })

		if (this.props.updatingSettings && !nextProps.updatingSettings) {
			this.dismissModal()
		}
	}

	onUpdate = () => {
		const { onUpdateSettingsAttempt } = this.props
		const { updatedSettingsSortBy, updatedSettingsOrder } = this.props

		onUpdateSettingsAttempt(updatedSettingsSortBy, updatedSettingsOrder)
	}

	animateIn = () => {
		const spring = Animated.spring

		spring(this.state.animTransform, {
			toValue: 0,
			friction: 10,
			tension: 40,
			useNativeDriver: true,
		}).start()
	}

	animateOut = (onComplete) => {
		const timing = Animated.timing

		timing(this.state.animTransform, {
			toValue: ss.constants.HEIGHT_DEVICE,
			duration: 250,
			useNativeDriver: true,
		}).start(onComplete)
	}

	dismissModal = () => {
		this.animateOut(NavigationActions.pop)
	}

	render() {
		const { updatingSettings } = this.props
		const { canUpdate } = this.state

		return (
			<Animated.View style={[styles.modal, { transform: [{ translateY: this.state.animTransform }] }]}>
				<NavBar
					title="Workbooks Settings"
					navigationBarStyle={{ borderBottomWidth: 1 }}
					renderLeftButton={() => (
						<NavBarIconButton
							name="cancel"
							onPress={this.dismissModal}
						/>
					)}
					renderRightButton={() => (
						<NavBarSaveButton
							active={canUpdate}
							attempting={updatingSettings}
							onPress={() => this.onUpdate()}
						/>
					)}
				/>
				<View>
					<Field
						ref={(c) => { this.settingsSortBy = c }}
						withRef
						name="settingsSortBy"
						label="Sort by"
						labelColor={ss.constants.COLOR_HEADING}
						options={{
							title: 'Title',
							reference: 'Unit Reference',
							workbook_reference: 'Workbook Reference',
							created: 'Date Created',
							modified: 'Date Modified',
						}}
						component={RadioField}
						editable={!updatingSettings}
						disabled={updatingSettings}
					/>
					<Field
						ref={(c) => { this.settingsOrder = c }}
						withRef
						name="settingsOrder"
						label="Order"
						labelColor={ss.constants.COLOR_HEADING}
						options={{
							asc: 'Ascending',
							desc: 'Descending',
						}}
						component={RadioField}
						editable={!updatingSettings}
						disabled={updatingSettings}
					/>
				</View>
			</Animated.View>
		)
	}

}

// StyleSheet
const {
	size,
} = ss

const styles = ss.create({
	modal: {
		position: 'absolute',
		zIndex: 1,
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: 'white',
		justifyContent: 'flex-start',
		paddingTop: ss.constants.HEIGHT_NAV_BAR + size(20),
		paddingBottom: size(30),
		paddingHorizontal: size(30),
	},
})

const IqaWorkbooksSettingsModalComponent = reduxForm({
	form: 'iqaWorkbooksSettings',
})(IqaWorkbooksSettingsModal)

const formSelector = formValueSelector('iqaWorkbooksSettings')


// Redux mappings
const mapStateToProps = (state) => {
	const iqa = state.iqa
	const { updatingSettings, settingsSortBy, settingsOrder } = iqa

	return {
		updatingSettings,
		initialValues: { settingsSortBy, settingsOrder },
		settingsSortBy,
		settingsOrder,
		updatedSettingsSortBy: formSelector(state, 'settingsSortBy'),
		updatedSettingsOrder: formSelector(state, 'settingsOrder'),
	}
}

const mapDispatchToProps = dispatch => ({
	onUpdateSettingsAttempt: (settingsSortBy, settingsOrder) => {
		dispatch(WorkbookActions.updateIqaWorkbooksSettingsAttempt(settingsSortBy, settingsOrder))
	},
})

export default connect(mapStateToProps, mapDispatchToProps)(IqaWorkbooksSettingsModalComponent)
