import React, { Component } from 'react'
import {
	View,
	Animated,
} from 'react-native'

import { Actions as NavigationActions } from 'react-native-router-flux'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import { connect } from 'react-redux'

import CommunityActions from '../actions/creator'
import common from '../../common'

import ss from '../../styles'

const { RadioField } = common.components.form
const { NavBar, NavBarIconButton, NavBarSaveButton } = common.components.navigation

class CommunitySettingsModal extends Component {
	state = {
		canUpdate: false,
		animTransform: new Animated.Value(ss.constants.HEIGHT_DEVICE),
	}

	componentDidMount() {
		this.animateIn()
	}

	componentWillReceiveProps(newProps) {
		const { settingsView, settingsType } = this.props
		const { updatedSettingsView, updatedSettingsType } = newProps

		let canUpdate = false
		if (settingsView !== updatedSettingsView) canUpdate = true
		if (!canUpdate && settingsType !== updatedSettingsType) canUpdate = true

		this.setState({ canUpdate })
	}

	onUpdate = () => {
		const { onUpdateSettingsAttempt } = this.props
		const { updatedSettingsView, updatedSettingsType } = this.props

		onUpdateSettingsAttempt(updatedSettingsView, updatedSettingsType)
		this.dismissModal()
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
					title="Community Settings"
					navigationBarStyle={{ borderBottomWidth: 1 }}
					renderLeftButton={() => (
						<NavBarIconButton name="cancel"
							onPress={this.dismissModal}
						/>
					)}
					renderRightButton={() => (
						<NavBarSaveButton
							active={canUpdate}
							attempting={updatingSettings}
							onPress={() => this.onUpdate()}
						/>
						)
					}
				/>
				<View>
					<Field
						ref={(c) => { this.settingsView = c }}
						withRef
						name="settingsView"
						label="Show as"
						labelColor={ss.constants.COLOR_HEADING}
						options={{ cards: 'Cards', list: 'List' }}
						// icons={[ss.images.iconCards, ss.images.iconList]}
						icons={['cardview', 'listview']}
						component={RadioField}
						editable
					/>
					{/* <Field
						ref="settingsType"
						withRef
						name="settingsType"
						label="Contact type"
						labelColor={ss.constants.COLOR_HEADING}
						options={{ all: 'All', students: 'Students', tutors: 'Tutors', brands: 'Brands' }}
						component={RadioField}
						editable
					/>*/}
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

const CommunitySettingsModalComponent = reduxForm({
	form: 'communitySettings',
})(CommunitySettingsModal)

const formSelector = formValueSelector('communitySettings')


// Redux mappings
const mapStateToProps = (state) => {
	const community = state.community
	const { updatingSettings, settingsView } = community
	return {
		updatingSettings,
		initialValues: { settingsView }, // , settingsType },
		settingsView,
		// settingsType,
		updatedSettingsView: formSelector(state, 'settingsView'),
		updatedSettingsType: formSelector(state, 'settingsType'),
	}
}

const mapDispatchToProps = dispatch => ({
	onUpdateSettingsAttempt: (settingsView, settingsType) => {
		dispatch(CommunityActions.updateCommunitySettingsAttempt(settingsView, settingsType))
	},
})

export default connect(mapStateToProps, mapDispatchToProps)(CommunitySettingsModalComponent)
