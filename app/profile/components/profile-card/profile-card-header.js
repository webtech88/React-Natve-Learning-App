import PropTypes from 'prop-types'
import React from 'react'
import {
	View,
	TouchableOpacity,
} from 'react-native'

import ss from '../../../styles'
import common from '../../../common'

const { TransText, Icon } = common.components.core

const ProfileCardHeader = ({
	title,
	onPress,
}) =>
	(<View style={styles.header}>
		<TransText style={styles.title} transkey={title} />
		<View style={styles.action}>
			{onPress &&
				<TouchableOpacity
					style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
					activeOpacity={0.8}
					onPress={onPress}
				>
					<Icon name="add" size={ss.size(16)} />
				</TouchableOpacity>
			}
		</View>
	</View>)

ProfileCardHeader.propTypes = {
	title: PropTypes.string.isRequired,
	onPress: PropTypes.func,
}

ProfileCardHeader.defaultProps = {
	onPress: null,
}

// StyleSheet
const {
	size,
	typo: { pSemiBold },
} = ss

const styles = ss.create({
	header: {
		paddingHorizontal: size(50),
		paddingVertical: size(15),
		borderBottomWidth: 1,
		borderBottomColor: 'rgba(0, 0, 0, .1)',
		alignItems: 'center',
	},
	action: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		right: 0,
		width: size(50),
		justifyContent: 'center',
		alignItems: 'center',
	},
	title: {
		...pSemiBold,
		color: ss.constants.COLOR_HEADING,
	},
})

export default ProfileCardHeader
