import PropTypes from 'prop-types'
import React from 'react'
import {
	View,
	Text,
	ViewPropTypes,
} from 'react-native'

import ss from '../../../styles'

const NewCounter = ({
	count,
    style,
}) => {
	const abbreviateCount = () =>
		// abbreviate if in the thousands or millions
		(count < 1000)
			? count
			: (count < 1000000
				? `${(count / 1000).toFixed(1)} K`
				: `${(count / 1000000).toFixed(1)} M`)

	return (
		<View style={[styles.new, style]}>
			<Text style={styles.count}>{abbreviateCount(count)}</Text>
		</View>
	)
}

NewCounter.propTypes = {
	count: PropTypes.number.isRequired,
	style: ViewPropTypes.style,
}

NewCounter.defaultProps = {
	style: {},
}

const {
	size,
	typo: { pSemiBold },
} = ss

const styles = {
	new: {
		borderRadius: 25,
		height: size(25),
		minWidth: size(25),
		backgroundColor: ss.constants.COLOR_ACCENT_RED,
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 2,
	},
	count: {
		...pSemiBold,
		fontSize: size(13),
		color: 'white',
		marginBottom: 2,
		backgroundColor: 'transparent',
	},
}

export default NewCounter
