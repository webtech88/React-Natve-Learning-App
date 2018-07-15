import PropTypes from 'prop-types'
import React from 'react'
import {
	View,
	Platform,
	Switch,
} from 'react-native'

import ss from '../../../styles'
import common from '../../../common'

const { TransText } = common.components.core

const SettingsNotificationsItem = ({
	text,
	switchOn,
	onValueChange,
}) => {
	let switchProps

	if (Platform.OS === 'android') {
		if (switchOn) {
			switchProps = {
				onTintColor: 'rgba(0, 0, 0, .25)',
				thumbTintColor: ss.constants.COLOR_CORE_BRAND,
			}
		} else {
			switchProps = {
				tintColor: 'rgba(0, 0, 0, .25)',
			}
		}
	} else {
		switchProps = {
			onTintColor: ss.constants.COLOR_CORE_BRAND,
		}
	}

	return (
		<View style={styles.viewItem}>
			<TransText style={styles.text} numberOfLines={1} transkey={text} />
			<Switch
				value={switchOn}
				onValueChange={onValueChange}
				{...switchProps}
			/>
		</View>
	)
}


SettingsNotificationsItem.propTypes = {
	text: PropTypes.string.isRequired,
	switchOn: PropTypes.bool.isRequired,
	onValueChange: PropTypes.func.isRequired,
}

// StyleSheet
const {
	size,
	typo: { p },
} = ss

const styles = ss.create({
	viewItem: {
		backgroundColor: 'white',
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: size(15),
		paddingHorizontal: size(20),
	},
	text: {
		...p,
		color: ss.constants.COLOR_HEADING,
		flex: 1,
		paddingRight: 10,
	},
})

export default SettingsNotificationsItem
