import PropTypes from 'prop-types'
import React from 'react'
import {
	Text,
	View,
} from 'react-native'

import ss from '../../../../styles'


const HeaderThree = ({ children, style }) => {
	const header = children[(1, 1)]
	const headerHasLength = header && header.toString().trim().length > 0

	return headerHasLength
		? <Text selectable style={[style, styles.h3]}>{children}</Text>
		: <View style={[style, styles.spacer]} />
}

HeaderThree.propTypes = {
	children: PropTypes.node.isRequired,
	style: Text.propTypes.style,
}

HeaderThree.defaultProps = {
	style: {},
}

// StyleSheet
const {
	size,
	typo: { h1 },
} = ss

const styles = ss.create({
	h3: {
		...h1,
		color: ss.constants.COLOR_CORE_BRAND,
		fontSize: size(16),
		lineHeight: size(22),
		marginBottom: size(10),
	},
	spacer: {
		height: ss.size(22),
		marginBottom: size(10),
	},
})


export default HeaderThree
