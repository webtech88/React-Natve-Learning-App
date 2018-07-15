import PropTypes from 'prop-types'
import React from 'react'

import ss from '../../../styles'
import common from '../../../common'

const { TransTouchable } = common.components.core

const SettingsMenuItem = ({
	text,
	detail,
	onPress,
}) =>
	(<TransTouchable
		underlayColor="#F9F9F9"
		onPress={onPress}
		viewstyle={styles.viewItem}
		titlestyle={styles.text}
		titlestring={text}
		textstyle={[styles.detail]}
		textstring={detail}
		iconcolor={ss.constants.COLOR_TINT_LIGHT}
		iconsize={ss.size(16)}
		iconname="next"
	/>)

SettingsMenuItem.propTypes = {
	text: PropTypes.string.isRequired,
	onPress: PropTypes.func.isRequired,
	detail: PropTypes.string,
}

SettingsMenuItem.defaultProps = {
	detail: undefined,
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
		paddingBottom: 2,
	},
	detail: {
		...p,
		flex: 1,
		paddingRight: 10,
		paddingBottom: 2,
		fontSize: size(12),
	},
})

export default SettingsMenuItem
