import PropTypes from 'prop-types'
import React from 'react'
import {
	View,
	ViewPropTypes,
} from 'react-native'

import Svg, { LinearGradient, Stop, Defs, Rect } from 'react-native-svg'

import ss from '../../../styles'

const TextFadeSvg = ({
	style,
	position,
}) => {
	const margin = (position === 'top') ? { marginBottom: -40 } : { marginTop: -40 }
	const y1 = (position === 'top') ? '100%' : '0%'
	const y2 = (position === 'top') ? '0%' : '100%'
	return (
		<View style={{ zIndex: 1, ...margin, ...style }}>
			<Svg width={ss.constants.WIDTH_DEVICE} height={50} >
				<Defs>
					<LinearGradient id="textFade" x1="0%" y1={y1} x2="0%" y2={y2}>
						<Stop offset="0%" stopColor="white" stopOpacity="0" />
						<Stop offset="80%" stopColor="white" stopOpacity="1" />
					</LinearGradient>
				</Defs>
				<Rect x="0" y="0" width={ss.constants.WIDTH_DEVICE} height={50} fill="url(#textFade)" />
			</Svg>
		</View>
	)
}

TextFadeSvg.propTypes = {
	position: PropTypes.oneOf(['top', 'bottom']).isRequired,
	style: ViewPropTypes.style,
}

TextFadeSvg.defaultProps = {
	position: 'bottom',
	style: {},
}

export default TextFadeSvg
