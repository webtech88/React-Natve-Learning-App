import PropTypes from 'prop-types'
import React from 'react'
import {
	View,
	Image,
} from 'react-native'

import ss from '../../../styles'

const ActivityImage = ({
	image,
}) => (
	<View style={styles.tout}>
		<Image
			style={{ flex: 1, width: null, height: null, backgroundColor: 'transparent' }}
			resizeMode="contain"
			source={ss.images.activityTout}
		/>
	</View>
)

ActivityImage.propTypes = {
	image: PropTypes.string,
}

// StyleSheet
const {
	size,
} = ss

const styles = ss.create({
	image: {
		flex: 1,
		width: null,
		height: null,
		backgroundColor: 'transparent',
	},
	tout: {
		marginTop: size(20),
		marginHorizontal: size(20),
		height: size(160),
	},
})

export default ActivityImage
