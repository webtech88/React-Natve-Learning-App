import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
	View,
	Text,
} from 'react-native'

import ss from '../../../../styles'
import common from '../../../../common'

const { CloudinaryImage } = common.components.core


class ImageBlock extends Component {
	render() {
		const { color, title, description, image } = this.props.data

		let fontColor = '#4a4a4a'
		if (color) {
			if (color === '#d4eae4' || color === '#ffffff' || color === '#d2db0f') {
				fontColor = '#4a4a4a'
			} else {
				fontColor = '#f9f9f9'
			}
		}

		return (
			<View
				style={[styles.block, { backgroundColor: color || '#F9F9F9' }]}
				onLayout={(e) => {
					this.setState({ top: e.nativeEvent.layout.y })
				}}
			>
				{image &&
					<View style={styles.image}>
						<CloudinaryImage
							publicId={image}
							placeholder="avatar-image"
							placeholderColor={(color === '#ffffff')
								? 'white'
								: ss.constants.COLOR_CLOUDINARY_PLACEHOLDER
							}
							placeholderSize={size(40)}
							width={size(250)}
							height={size(250)}
							options="contain"
							loadingColor={(color === '#ffffff') ? ss.constants.COLOR_CORE_BRAND : '#FFFFFF'}
						/>
					</View>
				}
				{(title || description)
					? <View>
						{title
							? <Text selectable style={[styles.title, { color: fontColor }]}>
								{title}
							</Text>
							: null
						}
						{description
							? <Text selectable style={[styles.description, { color: fontColor }]}>
								{description}
							</Text>
							: null
						}
					</View>
					: null
				}
			</View>
		)
	}

}

ImageBlock.propTypes = {
	data: PropTypes.shape({
		color: PropTypes.string,
		title: PropTypes.string,
		description: PropTypes.string,
		image: PropTypes.string,
	}).isRequired,
}

// StyleSheet
const {
	size,
	typo: { h1, p },
} = ss

const styles = ss.create({
	block: {
		paddingVertical: size(20),
		paddingHorizontal: size(20),
	},
	image: {
		marginVertical: size(10),
	},
	title: {
		...h1,
		fontSize: size(26),
		lineHeight: size(34),
		marginTop: size(20),
	},
	description: {
		...p,
		fontSize: size(16),
		lineHeight: size(22),
		marginTop: size(20),
		marginBottom: size(10),
	},
})


export default ImageBlock
