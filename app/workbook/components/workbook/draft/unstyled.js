import PropTypes from 'prop-types'
import React from 'react'
import {
	Text,
	View,
} from 'react-native'

import ss from '../../../../styles'


const Unstyled = ({ children, style }) => {
	const paragraph = children[(1, 1)]
	const paragraphHasLength = paragraph && paragraph.toString().trim().length > 0

	return paragraphHasLength
		? <Text selectable style={[style, styles.p]}>{children}</Text>
		: <View style={[style, styles.spacer]} />
}

Unstyled.propTypes = {
	children: PropTypes.node.isRequired,
	style: Text.propTypes.style,
}

Unstyled.defaultProps = {
	style: {},
}

// StyleSheet
const {
	size,
	typo: { p },
} = ss

const styles = ss.create({
	p: {
		...p,
		fontSize: size(16),
		lineHeight: size(22),
		opacity: 0.8,
	},
	spacer: {
		height: ss.size(22),
	},
})

export default Unstyled
