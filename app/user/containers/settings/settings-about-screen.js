import React, { Component } from 'react'
import {
	View,
	Image,
	TouchableHighlight,
	Linking,
} from 'react-native'

import DeviceInfo from 'react-native-device-info'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import ss from '../../../styles'
import common from '../../../common'

const { TransText, Icon } = common.components.core

class SettingsAboutScreen extends Component {

	handleClick = (url) => {
		Linking.canOpenURL(url).then((supported) => {
			if (supported) {
				Linking.openURL(url)
			} else {
				// TODO: if link fails
				console.log(`Cannot open ${url}`)
			}
		})
	}

	render() {
		return (
			<View style={styles.wrapper}>
				<View style={styles.logoContainer}>
					<Image resizeMode="contain"
						source={ss.images.logoAltWhiteText}
						style={styles.logo}
					/>
					<TransText style={[styles.p, { lineHeight: size(25) }]} transkey="GIVE_YOU_FEEDOM_EDUCATION" />
				</View>
				<View style={styles.social}>
					<TouchableHighlight
						onPress={() => {
							this.handleClick('https://www.facebook.com/pearsonplc')
						}}
						underlayColor="transparent"
						style={styles.socialIcon}
					>
						<FontAwesome name="facebook"
							color={ss.constants.COLOR_CORE_PRIMARY}
							size={ss.size(20)}
							style={{ backgroundColor: 'transparent' }}
						/>
					</TouchableHighlight>
					<TouchableHighlight
						onPress={() => {
							this.handleClick('https://www.twitter.com/pearsonplc')
						}}
						underlayColor="transparent"
						style={styles.socialIcon}
					>
						<FontAwesome name="twitter"
							color={ss.constants.COLOR_CORE_PRIMARY}
							size={ss.size(20)}
							style={{ backgroundColor: 'transparent' }}
						/>
					</TouchableHighlight>
				</View>

				<View style={styles.separator} />
				<View style={styles.version}>
					<TransText
						style={styles.p}
						transkeys={['Version', ' ', DeviceInfo.getVersion()]}
						tindices={[0]}
					/>
				</View>
				<View style={styles.separator} />
				<View style={styles.footer}>
					<TransText style={styles.pSmall} transkey="MADE_WITH" />
					<Icon name="heart"
						color="white"
						size={ss.size(22)}
						style={styles.withLove}
					/>
					<TransText style={styles.pSmall} transkey="IN_LONDON" />
				</View>
			</View>
		)
	}
}

// StyleSheet
const {
	size,
	base: { wrapper },
	typo: { p },
} = ss

const styles = ss.create({
	wrapper: {
		...wrapper,
		backgroundColor: ss.constants.COLOR_CORE_PRIMARY,
	},
	logoContainer: {
		alignItems: 'center',
		flex: 7,
		justifyContent: 'center',
		paddingHorizontal: size(60),
		paddingBottom: size(20),
	},
	logo: {
		width: 90,
		height: 165,
		marginBottom: size(20),
	},
	p: {
		...p,
		color: ss.constants.COLOR_CORE_LIGHT,
		textAlign: 'center',
	},
	social: {
		flex: 1.5,
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'center',
	},
	socialIcon: {
		alignItems: 'center',
		backgroundColor: 'white',
		borderRadius: size(35),
		height: size(35),
		justifyContent: 'center',
		marginHorizontal: size(10),
		opacity: 0.3,
		width: size(35),
	},
	separator: {
		borderColor: ss.constants.COLOR_TINT_DARK,
		borderTopWidth: 1,
		opacity: 0.2,
	},
	version: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		opacity: 0.5,
	},
	footer: {
		flex: 1.7,
		flexDirection: 'row',
		alignItems: 'flex-end',
		justifyContent: 'center',
		opacity: 0.5,
	},
	pSmall: {
		...p,
		color: ss.constants.COLOR_CORE_LIGHT,
		fontSize: size(12),
		marginBottom: size(20),
	},
	withLove: {
		marginHorizontal: size(5),
		marginBottom: size(18),
	},
})

export default SettingsAboutScreen
