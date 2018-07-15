import PropTypes from 'prop-types'
import React from 'react'
import {
	ViewPropTypes,
	TouchableOpacity,
	Animated,
} from 'react-native'

import ss from '../../../styles'
import CloudinaryImage from '../core/cloudinary-image'

const PhotosCardItem = ({
	style,
	photo: { media_id, cloudinary_file_id },
	size,
	gutter,
	onPress,
}) => (
	<Animated.View
		style={[styles.photo, style, { height: size, width: size, margin: gutter }]}
	>
		<TouchableOpacity
			style={{ flex: 1 }}
			activeOpacity={0.85}
			onPress={onPress}
		>
			<CloudinaryImage
				key={`PhotosCardItemImage_${media_id}`}
				publicId={cloudinary_file_id}
				width={size}
				height={size}
				options="cover"
			/>
		</TouchableOpacity>
	</Animated.View>
)

PhotosCardItem.propTypes = {
	style: ViewPropTypes.style,
	photo: PropTypes.shape({
		media_id: PropTypes.number.isRequired,
		cloudinary_file_id: PropTypes.string.isRequired,
	}).isRequired,
	size: PropTypes.number.isRequired,
	gutter: PropTypes.number.isRequired,
	onPress: PropTypes.func.isRequired,
}

PhotosCardItem.defaultProps = {
	style: {},
}


// StyleSheet
const styles = ss.create({
	photo: {
		backgroundColor: '#EEEEEE',
	},
})

export default PhotosCardItem
