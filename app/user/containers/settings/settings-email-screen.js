import React from 'react'
import {
	View,
	Text,
	TouchableOpacity,
} from 'react-native'

import { Actions as NavigationActions } from 'react-native-router-flux'
import { connect } from 'react-redux'

import common from '../../../common'

import ss from '../../../styles'

const { HeaderIcon, TransText } = common.components.core

const SettingsEmailScreen = ({
	user,
}) =>
	(<View style={styles.wrapper}>
		<View style={styles.container}>
			<View>
				<HeaderIcon onLayout={this.getInfoY}
					style={{ marginTop: size(15), marginBottom: size(40) }}
					name="email"
					size={ss.size(54)}
					// icon={ss.images.iconHeaderEmail}
					// iconWidth={53}
					// iconHeight={50}
				/>
				<Text style={styles.p}>
					{user.email}
				</Text>
				<TransText style={styles.grey} transkey="EMAIL_VERIFIED" />
			</View>
			<View>
				<TransText style={styles.grey} transkey="DONT_MISS_ANYTHING" />
				<TransText style={[styles.grey, { marginBottom: size(20) }]} transkey="SEND_NEWS_DIRECTLY" />
				<TouchableOpacity
					activeOpacity={0.9}
					onPress={NavigationActions.SettingsNotifications}
				>
					<TransText style={styles.link} transkey="Set Up Email Notifications"/>
				</TouchableOpacity>
			</View>
		</View>
	</View>)

// StyleSheet
const {
	size,
	base: { wrapper },
	typo: { p, link },
} = ss

const styles = ss.create({
	wrapper: {
		...wrapper,
	},
	container: {
		flex: 1,
		justifyContent: 'space-between',
		paddingHorizontal: size(50),
		paddingVertical: size(30),
	},
	p: {
		...p,
		textAlign: 'center',
		color: ss.constants.COLOR_CORE_PRIMARY,
		fontSize: size(18),
		marginBottom: size(10),
	},
	grey: {
		...p,
		textAlign: 'center',
		opacity: 0.8,
		lineHeight: size(20),
	},
	link: {
		...link,
		textAlign: 'center',
	},
})

// Redux mappings
const mapStateToProps = state => ({
	user: state.user.data,
})

export default connect(mapStateToProps)(SettingsEmailScreen)
