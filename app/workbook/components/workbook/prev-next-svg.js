import PropTypes from 'prop-types'
import React from 'react'
import {
	View,
} from 'react-native'

import Svg, { Circle, Polyline } from 'react-native-svg'

import ss from '../../../styles'

const PrevNextSvg = ({
	type,
}) =>
	(<View style={type === 'previous' ? { marginRight: ss.size(10) } : { marginLeft: ss.size(10) }}>
		<Svg width={30} height={30}>
			<Circle cx="15" cy="15" r="14" stroke={ss.constants.COLOR_CORE_BRAND} strokeWidth="1" fill="white" />
			<Polyline
				points={type === 'previous' ? '17,10 11,15 17,20' : '12,10 18,15 12,20'}
				fill="none"
				stroke={ss.constants.COLOR_CORE_BRAND}
				strokeWidth="2"
			/>

		</Svg>
	</View>)

PrevNextSvg.propTypes = {
	type: PropTypes.oneOf(['previous', 'next']).isRequired,
}

PrevNextSvg.defaultProps = {
	type: 'next',
}

export default PrevNextSvg
