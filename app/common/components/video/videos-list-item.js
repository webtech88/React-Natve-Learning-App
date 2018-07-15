import PropTypes from 'prop-types'
import React from 'react'
import {
	View,
	TouchableOpacity,
} from 'react-native'

import { formatTime } from '../../util/helpers'
import ss from '../../../styles'
import CloudinaryImage from '../core/cloudinary-image'
import TransText from '../core/transtext'
import Icon from '../core/icon'

const {
	size,
	typo: { p },
} = ss

const VideosListItem = ({
	video,
	onPress,
}) => {
	const { cloudinary_file_id, title, description, duration } = video

	return (
		<TouchableOpacity
			style={{ flex: 1 }}
			activeOpacity={0.85}
			onPress={onPress}
		>
			<View style={styles.video}>
				<View style={styles.preview}>
					{cloudinary_file_id &&
						<CloudinaryImage
							style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
							publicId={cloudinary_file_id}
							width={size(125)}
							height={size(90)}
							options="poster"
						/>
					}
					<View style={styles.playButtonContainer}>
						<Icon name="play-button" size={size(28)} color="white" />
					</View>
					{duration && duration > 0 &&
						<TransText style={styles.duration} transkey={formatTime(duration)} />
					}
				</View>
				<View style={{ flex: 1 }}>
					<View style={styles.header}>
						<View style={{ flex: 1 }}>
							<TransText style={styles.title} numberOfLines={2} transkey={title} />
						</View>
						{/* TODO {showActionSheetButton &&
							<View style={styles.actions}>
								<ActionSheetButton onPress={() => NavigationActions.ActionSheetModal()} />
							</View>
						} */}
					</View>
					<TransText style={styles.desc} numberOfLines={2} transkey={description} />
				</View>
			</View>
		</TouchableOpacity>
	)
}

VideosListItem.propTypes = {
	video: PropTypes.shape({
		cloudinary_file_id: PropTypes.string.isRequired,
		title: PropTypes.string.isRequired,
		description: PropTypes.string.isRequired,
	}).isRequired,
	onPress: PropTypes.func.isRequired,
}


// StyleSheet
const styles = ss.create({
	video: {
		flex: 1,
		flexDirection: 'row',
		paddingVertical: size(10),
		paddingHorizontal: size(20),
		backgroundColor: 'white',
	},
	preview: {
		width: size(125),
		height: size(90),
		marginRight: size(15),
		position: 'relative',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'black',
	},
	playButtonContainer: {
		backgroundColor: 'rgba(255, 255, 255, 0.1)',
		height: size(40),
		width: size(40),
		borderRadius: size(40),
		alignItems: 'center',
		justifyContent: 'center',
		paddingLeft: size(5),
	},
	duration: {
		...p,
		color: 'white',
		fontSize: size(12),
		position: 'absolute',
		right: 2,
		bottom: 2,
		padding: 2,
		backgroundColor: 'rgba(0, 0, 0, 0.7)',
	},
	header: {
		// backgroundColor: 'pink', // NOTE testing flexbox
		flexDirection: 'row',
		marginBottom: size(5),
	},
	title: {
		...p,
	},
	actions: {
		// backgroundColor: 'pink', // NOTE testing flexbox
		top: -size(5),
		right: -size(10),
	},
	desc: {
		...p,
		fontSize: size(12),
		opacity: 0.7,
	},
})


export default VideosListItem
