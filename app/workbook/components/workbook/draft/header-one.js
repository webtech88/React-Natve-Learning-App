import PropTypes from 'prop-types'
import React from 'react'
import {
	View,
	Text,
} from 'react-native'

import ss from '../../../../styles'


const HeaderOne = ({ children, style }) => {
	const header = children[(1, 1)]
	const headerHasLength = header && header.toString().trim().length > 0

	return headerHasLength
		? <Text selectable style={[style, styles.h1]}>{children}</Text>
		: <View style={[style, styles.spacer]} />
}

HeaderOne.propTypes = {
	children: PropTypes.node.isRequired,
	style: Text.propTypes.style,
}

HeaderOne.defaultProps = {
	style: {},
}


// StyleSheet
const {
	size,
	typo: { h1 },
} = ss

const styles = ss.create({
	h1: {
		...h1,
		fontSize: size(26),
		lineHeight: size(34),
		marginBottom: size(20),
	},
	spacer: {
		height: ss.size(34),
		marginBottom: size(20),
	},
})


export default HeaderOne
