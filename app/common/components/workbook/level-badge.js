import PropTypes from 'prop-types'
import React from 'react'
import {
	View,
	ViewPropTypes
} from 'react-native'

import ss from '../../../styles'
import TransText from '../core/transtext'

const LevelBadge = ({
	style,
	level,
}) =>
	(<View style={[styles.level, { backgroundColor: ss.constants.COLOR_LEVEL_1 }, style]}>
		<TransText 
			style={styles.pLevel} 
			transkeys={['LEVEL', ' ', level]} 
			tindices={[0]} 
		/>
	</View>)

LevelBadge.propTypes = {
	style: ViewPropTypes.style,
	level: PropTypes.number.isRequired,
}

LevelBadge.defaultProps = {
	style: {},
}


// StyleSheet

const {
	size,
	typo: { p },
} = ss


const styles = ss.create({
	level: {
		height: size(30),
		paddingHorizontal: size(20),
		borderRadius: 100,
		justifyContent: 'center',
	},
	pLevel: {
		...p,
		color: 'white',
		fontSize: size(13),
		paddingBottom: 2,
	},
})

export default LevelBadge
