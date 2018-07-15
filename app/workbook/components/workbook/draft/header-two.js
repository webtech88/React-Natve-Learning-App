import PropTypes from 'prop-types'
import React from 'react'
import {
	Text,
	View,
} from 'react-native'

import ss from '../../../../styles'


const HeaderTwo = ({ children, style }) => {
	const header = children[(1, 1)]
	const headerHasLength = header && header.toString().trim().length > 0

	return headerHasLength
		? <Text selectable style={[style, styles.h2]}>{children}</Text>
		: <View style={[style, styles.spacer]} />
}

HeaderTwo.propTypes = {
	children: PropTypes.node.isRequired,
	style: Text.propTypes.style,
}

HeaderTwo.defaultProps = {
	style: {},
}

// StyleSheet
const {
	size,
	typo: { h1 },
} = ss

const styles = ss.create({
	h2: {
		...h1,
		color: ss.constants.COLOR_CORE_BRAND,
		fontSize: size(20),
		lineHeight: size(26),
		marginBottom: size(10),
	},
	spacer: {
		height: ss.size(26),
		marginBottom: size(10),
	},
})


export default HeaderTwo
