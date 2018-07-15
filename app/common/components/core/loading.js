import PropTypes from 'prop-types'
import React from 'react'
import {
	ActivityIndicator,
	View,
	ViewPropTypes
} from 'react-native'

import ss from '../../../styles'
import TransText from './transtext'

const Loading = ({
	style,
	size,
	color,
	message,
}) => (
	<View style={[styles.loading, style]}>
		<ActivityIndicator size={size} color={color} />
		{message && <TransText style={[styles.message, { color }]} transkey={message} />}
	</View>
)


Loading.propTypes = {
	style: ViewPropTypes.style,
	size: PropTypes.oneOf(['small', 'large']).isRequired,
	color: PropTypes.string.isRequired,
	message: PropTypes.string,
}

Loading.defaultProps = {
	style: null,
	size: 'small',
	color: 'rgba(0, 0, 0, .25)',
	message: null,
}


// StyleSheet
const {
	size,
	typo: { p },
} = ss

const styles = ss.create({
	loading: {
		// backgroundColor: 'pink', // NOTE testing flexbox
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	message: {
		...p,
		color: ss.constants.COLOR_HEADING,
		marginTop: size(20),
	},
})

export default Loading
