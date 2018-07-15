import React, { Component } from 'react'
import { View } from 'react-native'

import { connect } from 'react-redux'

import SettingsNotificationsItem from '../../components/settings/settings-notifications-item'

import ss from '../../../styles'
import common from '../../../common'

const { TransText } = common.components.core

class SettingsNotificationsScreen extends Component {
	state = {
		pushNotificationNewMessage: true,
		pushNotificationNewConnection: true,
		emailNewMessage: true,
		emailNewConnection: true,
		emailNewsAndUpdates: true,
	}

	togglePushNotificationNewMessage = () => {
		this.setState({ pushNotificationNewMessage: !this.state.pushNotificationNewMessage })
	}

	togglePushNotificationNewConnection = () => {
		this.setState({ pushNotificationNewConnection: !this.state.pushNotificationNewConnection })
	}

	toggleEmailNewMessage = () => {
		this.setState({ emailNewMessage: !this.state.emailNewMessage })
	}

	toggleEmailNewConnection = () => {
		this.setState({ emailNewConnection: !this.state.emailNewConnection })
	}

	toggleEmailNewsAndUpdates = () => {
		this.setState({ emailNewsAndUpdates: !this.state.emailNewsAndUpdates })
	}

	render() {
		const {
			pushNotificationNewMessage,
			pushNotificationNewConnection,
			emailNewMessage,
			emailNewConnection,
			emailNewsAndUpdates,
		} = this.state

		return (
			<View style={styles.wrapper}>
				<View style={styles.sectionHeader}>
					<TransText style={styles.pLight} transkey="Push Notifications" />
				</View>
				<View style={styles.divider} />
				<SettingsNotificationsItem text="New Message"
					switchOn={pushNotificationNewMessage}
					onValueChange={this.togglePushNotificationNewMessage}
				/>
				<View style={styles.divider} />
				<SettingsNotificationsItem text="New Connection"
					switchOn={pushNotificationNewConnection}
					onValueChange={this.togglePushNotificationNewConnection}
				/>
				<View style={styles.divider} />

				<View style={styles.sectionHeader}>
					<TransText style={styles.pLight} transkey="Email Notifications" />
				</View>
				<View style={styles.divider} />
				<SettingsNotificationsItem text="New Message"
					switchOn={emailNewMessage}
					onValueChange={this.toggleEmailNewMessage}
				/>
				<View style={styles.divider} />
				<SettingsNotificationsItem text="New Connection"
					switchOn={emailNewConnection}
					onValueChange={this.toggleEmailNewConnection}
				/>
				<View style={styles.divider} />
				<SettingsNotificationsItem text="News and Updates"
					switchOn={emailNewsAndUpdates}
					onValueChange={this.toggleEmailNewsAndUpdates}
				/>
				<View style={styles.divider} />
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
	sectionHeader: {
		paddingVertical: size(10),
		paddingHorizontal: size(20),
	},
	divider: {
		height: 0,
		borderColor: 'rgba(0, 0, 0, 0.1)',
		borderBottomWidth: 1,
	},
	pLight: {
		...pLight,
		fontSize: size(18),
		marginTop: size(10),
	},
})

export default connect(null)(SettingsNotificationsScreen)
