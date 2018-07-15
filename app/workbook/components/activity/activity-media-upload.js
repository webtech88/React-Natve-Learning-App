import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
	View,
	TouchableOpacity,
	Image,
	LayoutAnimation,
} from 'react-native'

import common from '../../../common'

import ss from '../../../styles'

const { ImagePicker, MediaUploader } = common.util
const { CloudinaryImage, TransText, Icon } = common.components.core

class ActivityMediaUpload extends Component {
	state = {
		isUploading: false,
		media: this.props.media || null,
	}

	onUploadPress = () => {
		const { userId, onMediaUploadComplete } = this.props

		ImagePicker.showImagePicker().then((photo) => {
			if (photo.error) return
			if (photo.uri) {
				this.changeState({ isUploading: true })
				MediaUploader.upload(photo.uri, userId)
					.then((response) => {
						this.changeState({ media: response.cloudId, isUploading: false })
						onMediaUploadComplete(response.cloudId)
					})
					.catch(() => this.changeState({ isUploading: false }))
			}
		}).catch(() => this.changeState({ isUploading: false }))
	}

	changeState = (state) => {
		LayoutAnimation.easeInEaseOut()
		this.setState(state)
	}

	render() {
		const { canModify } = this.props
		const { isUploading, media } = this.state
		const UploadButton = canModify ? TouchableOpacity : View

		return (
			<View style={styles.container} >
				{!isUploading && !media && (
					<UploadButton style={styles.uploadButton} onPress={this.onUploadPress}>
						<TransText style={styles.uploadButtonLabel} transkey="UPLOAD" />
					</UploadButton>
				)}
				{isUploading && !media && (
					<View>
						<View style={styles.uploadingContainer}>
							<Image source={ss.images.iconActivityUpload} style={styles.uploadingIcon} />
						</View>
						<TransText style={styles.uploadingLabel} transkey="UPLOADING" />
					</View>
				)}
				{!isUploading && media && (
				<CloudinaryImage
					publicId={media}
					width={size(240)}
					height={size(240)}
					options="contain"
					loadingColor={ss.constants.COLOR_CORE_BRAND}
				/>
				)}
				{canModify && !isUploading && media && (
					<TouchableOpacity style={styles.deleteContainer} onPress={() => this.props.onDeletePress(media)}>
						<Icon name="delete"
							color={ss.constants.COLOR_ACCENT_RED}
							size={ss.size(25)}
						/>
					</TouchableOpacity>
				)}
			</View>
		)
	}
}

ActivityMediaUpload.propTypes = {
	onMediaUploadComplete: PropTypes.func.isRequired,
	userId: PropTypes.number.isRequired,
	onDeletePress: PropTypes.func.isRequired,
}

// StyleSheet
const {
	size,
	typo: { p },
} = ss

const styles = ss.create({
	container: {
		backgroundColor: '#f9f9f9',
		padding: size(20),
		justifyContent: 'center',
		alignItems: 'center',
	},
	uploadButton: {
		backgroundColor: '#d2d931',
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: size(16),
		paddingHorizontal: size(20),
		borderRadius: 2,
	},
	uploadButtonLabel: {
		...p,
		fontSize: size(15),
		color: ss.constants.COLOR_CORE_PRIMARY,
	},
	uploadingContainer: {
		backgroundColor: '#d5eae4',
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: size(75),
		paddingHorizontal: size(120),
	},
	uploadingIcon: {
		opacity: 0.3,
		height: size(52),
		resizeMode: 'contain',
	},
	uploadingLabel: {
		paddingTop: size(10),
		...p,
		fontSize: size(12),
		color: ss.constants.COLOR_CORE_BRAND,
	},
	deleteContainer: {
		padding: size(10),
		backgroundColor: '#f0f0f0',
		position: 'absolute',
		right: 0,
		top: 0,
	},
	delete: {

	},
})

export default ActivityMediaUpload
