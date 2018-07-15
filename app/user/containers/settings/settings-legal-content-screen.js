import React from 'react'
import {
	View,
	ScrollView,
} from 'react-native'

import ss from '../../../styles'
import common from '../../../common'

const { TransText } = common.components.core

const SettingsLegalContentScreen = ({
	title,
	info,
}) => {
	if (!title) {
		return (
			<View style={styles.wrapper}>
				<View style={styles.container}>
					<TransText style={styles.h2} transkey="ERROR" />
					<TransText style={styles.p} transkey="LOOKS_LIKE_ERROR" />
				</View>
			</View>
		)
	}

	return (
		<View style={styles.wrapper}>
			<ScrollView contentContainerStyle={styles.container}
				showsVerticalScrollIndicator
				directionalLockEnabled
			>
				{info}
			</ScrollView>
		</View>
	)
}

// StyleSheet
const {
	size,
	base: { wrapper },
	typo: { h2, p },
} = ss

const styles = ss.create({
	wrapper: {
		...wrapper,
	},
	container: {
		padding: size(20),
		paddingBottom: size(0),
	},
	h2: {
		...h2,
		paddingBottom: size(10),
	},
	p: {
		...p,
	},
})

export default SettingsLegalContentScreen
