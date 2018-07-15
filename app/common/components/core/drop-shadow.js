import PropTypes from 'prop-types'
import React from 'react'
import {
	View,
} from 'react-native'

import ss from '../../../styles'

const {
	size,
} = ss


const DropShadow = ({
	width, shadowType,
}) => {
	let customStyle = {}

	if (shadowType === 'chat') {
		customStyle = {
			// marginHorizental: size(50),
			shadowOffset: {
				height: 15,
				width: 0,
			},
			shadowRadius: 15,
			android: {
				elevation: 30,
			},
		}
	}

	return <View style={[styles.dropShadow, customStyle, { width }]} />
}

DropShadow.propTypes = {
	width: PropTypes.number,
	shadowType: PropTypes.string,
}

DropShadow.defaultProps = {
	width: ss.constants.WIDTH_DEVICE - size(100),
	shadowType: 'profile',
}

const styles = {
	dropShadow: {
		backgroundColor: 'white',
		zIndex: -1,
		height: 50,
		top: 0,
		marginTop: -(51),
		alignSelf: 'center',
		shadowColor: 'black',
		shadowOffset: {
			height: 2,
			width: 0,
		},
		shadowOpacity: 0.3,
		shadowRadius: 10,
		elevation: 10,
	},
}

export default DropShadow
