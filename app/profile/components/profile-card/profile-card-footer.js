import PropTypes from 'prop-types'
import React from 'react'
import {
	TouchableOpacity,
} from 'react-native'

import ss from '../../../styles'
import common from '../../../common'

const { TransText } = common.components.core

const ProfileCardFooter = ({
	onPress,
}) => {
	if (!onPress) return null

	return (
		<TouchableOpacity
			style={styles.footer}
			activeOpacity={0.8}
			onPress={onPress}
		>
			<TransText style={styles.link} transkey="SHOW_ALL" />
		</TouchableOpacity>
	)
}

ProfileCardFooter.propTypes = {
	onPress: PropTypes.func,
}

ProfileCardFooter.defaultProps = {
	onPress: null,
}

// StyleSheet
const {
	size,
	typo: { link },
} = ss

const styles = ss.create({
	footer: {
		height: size(40),
		borderTopWidth: 1,
		borderTopColor: 'rgba(0, 0, 0, .1)',
		justifyContent: 'center',
		alignItems: 'center',
		paddingBottom: 1,
	},
	link: {
		...link,
	},
})

export default ProfileCardFooter
