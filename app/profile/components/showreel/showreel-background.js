import PropTypes from 'prop-types'
import React from 'react'
import {
	View,
} from 'react-native'

import Svg, { RadialGradient, Stop, Defs, Rect } from 'react-native-svg'

import ss from '../../../styles'
import common from '../../../common'

const { CloudinaryImage } = common.components.core

const WIDTH = ss.constants.WIDTH_DEVICE
const HEIGHT = ss.constants.HEIGHT_DEVICE

const ShowreelBackground = ({ cloudinaryPublicId }) => (
	<View style={[styles.container, { overflow: 'hidden' }]}>
		{cloudinaryPublicId && <CloudinaryImage
			style={styles.container}
			publicId={cloudinaryPublicId}
			width={WIDTH}
			height={HEIGHT}
			options="cover"
		/>}
		<View style={styles.gradient}>
			<Svg height={HEIGHT} width={WIDTH}>
				<Defs>
					<RadialGradient id="bgGradient" rx="100%" ry="50%">
						<Stop offset="0" stopColor="black" stopOpacity="0.3" />
						<Stop offset="1" stopColor="black" stopOpacity="0.7" />
					</RadialGradient>
				</Defs>
				<Rect x="0" y="0" width={WIDTH} height={HEIGHT} fill="url(#bgGradient)" />
			</Svg>
		</View>
	</View>
)

ShowreelBackground.propTypes = {
	cloudinaryPublicId: PropTypes.string,
}

ShowreelBackground.defaultProps = {
	cloudinaryPublicId: null,
}


// StyleSheet
const styles = ss.create({
	container: {
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
	},
	gradient: {
		zIndex: 1,
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, .4)',
	},
})

export default ShowreelBackground
