import React, { Component } from 'react'
import {
	ScrollView,
	RefreshControl,
	View,
} from 'react-native'

import { Actions as NavigationActions } from 'react-native-router-flux'
import { connect } from 'react-redux'

import UserActions from '../../actions/creator'
import SettingsMenuItem from '../../components/settings/settings-menu-item'

import ss from '../../../styles'
import common from '../../../common'

const { TransText } = common.components.core

class SettingsMenuScreen extends Component {

	state = {
		refreshing: true,
	}

	componentDidMount() {
		this.props.getUser()
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.gettingUser && !nextProps.gettingUser) {
			this.setState({ refreshing: false })
		}
	}

	onRefresh = () => {
		this.setState({ refreshing: true })
		this.props.getUser()
	}

	render() {
		const {
			user,
			navigateToSettingsPersonalInfo,
			navigateToSettingsEmail,
			navigateToSettingsRegistrationCodes,
			navigateToSettingsPassword,
			navigateToSettingsPhone,
			navigateToSettingsSocial,
			navigateToSettingsNotifications,
			navigateToSettingsLegal,
			navigateToSettingsAbout,
			navigateToSettingsLanguage,
		} = this.props

		const { screen_name, email, uk_mobile_number } = user

		return (
			<View style={styles.wrapper}>
				<ScrollView
					contentContainerStyle={styles.viewMenu}
					showsVerticalScrollIndicator={false}
					directionalLockEnabled
					scrollEventThrottle={16}
					refreshControl={
						<RefreshControl
							refreshing={this.state.refreshing}
							onRefresh={this.onRefresh}
						/>
					}
				>
					<View style={styles.sectionHeader}>
					<TransText style={styles.pLight} transkey="GENERAL" />
					</View>
					<View style={styles.divider} />
					<SettingsMenuItem text="Language"
						onPress={navigateToSettingsLanguage}
					/>
					<View style={styles.divider} />
					<View style={styles.sectionHeader}>
						<TransText style={styles.pLight} transkey="ACCOUNT" />
					</View>
					<View style={styles.divider} />
					<SettingsMenuItem text="Personal Info"
						detail={screen_name}
						onPress={navigateToSettingsPersonalInfo}
					/>
					<View style={styles.divider} />
					<SettingsMenuItem text="Email"
						detail={email}
						onPress={navigateToSettingsEmail}
					/>
					<View style={styles.divider} />
					<SettingsMenuItem text="Registration Codes"
						detail="HH-65-J8-KK-7Y"
						onPress={navigateToSettingsRegistrationCodes}
					/>
					<View style={styles.divider} />
					<SettingsMenuItem text="Change Password"
						onPress={navigateToSettingsPassword}
					/>
					<View style={styles.divider} />
					<SettingsMenuItem text="Phone Number"
						detail={uk_mobile_number}
						onPress={navigateToSettingsPhone}
					/>
					<View style={styles.divider} />
					<SettingsMenuItem text="Social Connections"
						onPress={navigateToSettingsSocial}
					/>
					<View style={styles.divider} />
					<View style={styles.sectionHeader}>
					<TransText style={styles.pLight} transkey="COMMUNICATIONS" />
					</View>
					<View style={styles.divider} />
					<SettingsMenuItem text="Push and Email Notifications"
						onPress={navigateToSettingsNotifications}
					/>
					<View style={styles.divider} />
					<View style={styles.sectionHeader} />
					<View style={styles.divider} />
					<SettingsMenuItem text="Legal"
						onPress={navigateToSettingsLegal}
					/>
					<View style={styles.divider} />
					<SettingsMenuItem text="About"
						onPress={navigateToSettingsAbout}
					/>
					<View style={styles.divider} />
				</ScrollView>
			</View>
		)
	}

}

// StyleSheet
const {
	size,
	base: { wrapper },
	typo: { pLight },
} = ss

const styles = ss.create({
	wrapper: {
		...wrapper,
		backgroundColor: '#F9F9F9',
	},
	viewMenu: {
		paddingBottom: size(20),
	},
	sectionHeader: {
		paddingVertical: size(10),
		paddingHorizontal: size(20),
	},
	pLight: {
		...pLight,
		fontSize: size(18),
		marginTop: size(10),
	},
	divider: {
		height: 0,
		borderColor: 'rgba(0, 0, 0, 0.1)',
		borderBottomWidth: 1,
	},
})

// Redux mappings
const mapStateToProps = state => ({
	gettingUser: state.user.gettingUser,
	user: state.user.data,
})

const mapDispatchToProps = dispatch => ({
	getUser: () => {
		dispatch(UserActions.getUserAttempt())
	},
	navigateToSettingsPersonalInfo: () => {
		NavigationActions.SettingsPersonalInfo()
	},
	navigateToSettingsEmail: () => {
		NavigationActions.SettingsEmail()
	},
	navigateToSettingsRegistrationCodes: () => {
		NavigationActions.SettingsRegistrationCodes()
	},
	navigateToSettingsPassword: () => {
		NavigationActions.SettingsPassword()
	},
	navigateToSettingsPhone: () => {
		NavigationActions.SettingsPhone()
	},
	navigateToSettingsSocial: () => {
		NavigationActions.SettingsSocial()
	},
	navigateToSettingsNotifications: () => {
		NavigationActions.SettingsNotifications()
	},
	navigateToSettingsLegal: () => {
		NavigationActions.SettingsLegal()
	},
	navigateToSettingsAbout: () => {
		NavigationActions.SettingsAbout()
	},
	navigateToSettingsLanguage: () => {
		NavigationActions.SettingsLanguage()
	},
})

export default connect(mapStateToProps, mapDispatchToProps)(SettingsMenuScreen)
