import PropTypes from 'prop-types'
import React from 'react'
import {
	View,
} from 'react-native'

import Svg, { Polyline } from 'react-native-svg'

import ss from '../../../styles'

const PrevNextSvg = ({
    type,
    disabled,
	double,
}) => (
	<View>
		<Svg width={30} height={30}>
			<Polyline
				points={type === 'previous' ? '17,10 11,15 17,20' : (double ? '9,10 15,15 9,20' : '12,10 18,15 12,20')}
				fill="none"
				stroke={disabled ? 'rgb(0, 48, 87, 0.3)' : ss.constants.COLOR_CORE_PRIMARY}
				strokeWidth="2"
			/>
			{double && (<Polyline
				points={'15,10 21,15 15,20'}
				fill="none"
				stroke={disabled ? 'rgb(0, 48, 87, 0.3)' : ss.constants.COLOR_CORE_PRIMARY}
				strokeWidth="2"
			/>
			)}
		</Svg>
	</View>
)

PrevNextSvg.propTypes = {
	type: PropTypes.oneOf(['previous', 'next']).isRequired,
	disabled: PropTypes.bool,
	double: PropTypes.bool,
}

PrevNextSvg.defaultProps = {
	type: 'next',
	disabled: false,
	double: false,
}


export default PrevNextSvg
