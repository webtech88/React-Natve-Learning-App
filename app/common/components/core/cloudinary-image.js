import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import {
	Image,
	View,
	ViewPropTypes,
	Platform,
} from 'react-native'

import cloudinary from 'cloudinary-core'
import Config from 'react-native-config'

import Loading from './loading'
import Icon from './icon'
import cloudinaryConfiguration from '../../../core/config/cloudinary'
import { getCloudinaryFileMetadata } from '../../util/helpers'

import ss from '../../../styles'

const RATIO = 2

class CloudinaryImage extends PureComponent {

	state = {
		isFetchingImage: true,
		imageUri: null,
		imageWidth: null,
		imageHeight: null,
	}

	componentDidMount() {
		this.cl = cloudinary.Cloudinary.new({ cloud_name: Config.CLOUDINARY_CLOUD_NAME })

		if (this.props.publicId) {
			this.setCloudinaryUri(this.props)
		}
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.publicId !== nextProps.publicId) {
			if (nextProps.publicId) {
				this.setCloudinaryUri(nextProps)
			} else {
				this.setState({ isFetchingImage: false, imageUri: null, imageWidth: null, imageHeight: null })
			}
		}
	}

	componentWillUnmount() {
		this.cl = null
	}

	setCloudinaryUri(props) {
		const { publicId, options, width: targetWidth, height: targetHeight } = props
		let urlOptions = cloudinaryConfiguration[options]

		if (targetWidth) {
			urlOptions = {
				...urlOptions,
				width: (Platform.OS === 'android' ? Math.round(targetWidth) : targetWidth) * RATIO,
			}
		}
		if (targetHeight) {
			urlOptions = {
				...urlOptions,
				height: (Platform.OS === 'android' ? Math.round(targetHeight) : targetHeight) * RATIO,
			}
		}

		if (options !== 'poster') {
			getCloudinaryFileMetadata(publicId).then(({ width, height, format }) => {
				if (this.cl) {
					let state

					if (width && height) {
						const imageRatio = width / height

						if (imageRatio > 1) {
							// image is landscape
							state = {
								imageWidth: targetWidth,
								imageHeight: Math.round(targetHeight / imageRatio),
							}
						} else {
							// image is portrait
							state = {
								imageWidth: Math.round(targetWidth / imageRatio),
								imageHeight: targetHeight,
							}
						}

						if (state) {
							this.setState(state)
						}
					}

					return this.cl.url(`${publicId}.${format === 'svg' ? 'png' : format}`, {
						secure: true,
						...urlOptions,
					})
				}
			})
			.catch(() => {
				if (this.cl) {
					this.setState({ isFetchingImage: false })
				}

				return Promise.reject()
			})
			.then(imageUri => this.cl && this.setState({ imageUri }))
			.catch(() => {})
		} else {
			if (this.cl) {
				const response = this.cl.url(`${publicId}.jpg`, {
					secure: true,
					...urlOptions,
				})

				this.setState({ imageUri: response })
			}
		}
	}

	render() {
		const { isFetchingImage, imageUri, imageWidth, imageHeight } = this.state
		const {
			style,
			borderRadius,
			publicId,
			placeholder,
			placeholderColor,
			placeholderSize,
			placeholderOpacity,
			placeholderBackground,
			width,
			height,
			options,
			isLoading,
			loadingColor,
			placeholderResizeMode,
		} = this.props

		let rendered = null
		let containerStyle = { width, height }
		let imageProps

		if (!publicId && !placeholder) {
			return null
		}

		let imageStyle = {
			flex: 1,
			resizeMode: 'contain',
			backgroundColor: 'transparent',
		}

		imageProps = Object.assign({}, imageProps, { style: imageStyle })

		if (imageUri) {
			if (options !== 'contain') {
				imageStyle = {
					...imageStyle,
					resizeMode: 'cover',
				}
			} else {
				// NOTE some crop options won't return image in specified size
				containerStyle = {
					flex: 1,
					width: imageWidth,
					height: imageHeight,
				}
			}

			imageProps = Object.assign({}, imageProps, { style: imageStyle, source: { uri: imageUri } })

			rendered = (
				<Image
					// onLoadStart={() => this.setState({ isFetchingImage: true })} // TODO BUG buggy on Android
					onLoadEnd={() => this.setState({ isFetchingImage: false })}
					borderRadius={Platform.OS === 'android' ? borderRadius : 0}
					{...imageProps}
				>
					{(isFetchingImage || isLoading) && <Loading color={loadingColor} />}
				</Image>
			)
		}

		return (
			<View
				style={[
					styles.container,
					containerStyle,
					style,
					{ borderRadius },
				]}
			>
				{(rendered === null) && placeholder &&
					<View style={[styles.placeholder, { backgroundColor: placeholderBackground }]}>
						<View style={styles.placeholder}>
							<Icon
								name={placeholder}
								color={placeholderColor}
								size={placeholderSize}
								style={{ opacity: placeholderOpacity }}
							/>
							{/* NOTE: Old image props <Image
								style={{ width: placeholderSize, height: placeholderSize }}
								resizeMode={placeholderResizeMode}
								source={placeholder}
							/> */}
						</View>
						{isLoading && <Loading color={loadingColor} />}
					</View>
				}
				{rendered}
			</View>
		)
	}
}

CloudinaryImage.propTypes = {
	style: ViewPropTypes.style,
	borderRadius: PropTypes.number,
	publicId: PropTypes.string,
	placeholder: PropTypes.oneOfType([
		PropTypes.string,
		Image.propTypes.source,
	]),
	placeholderColor: PropTypes.string,
	placeholderSize: PropTypes.number,
	placeholderOpacity: PropTypes.number,
	placeholderBackground: PropTypes.string,
	options: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	isLoading: PropTypes.bool.isRequired,
	loadingColor: PropTypes.string.isRequired,
	placeholderResizeMode: PropTypes.string,
}

CloudinaryImage.defaultProps = {
	style: {},
	borderRadius: 0,
	publicId: null,
	placeholder: null,
	placeholderColor: ss.constants.COLOR_CLOUDINARY_PLACEHOLDER,
	placeholderSize: ss.size(50),
	placeholderOpacity: 0.6,
	placeholderBackground: 'transparent',
	options: null,
	isLoading: false,
	loadingColor: '#FFFFFF',
	placeholderResizeMode: 'contain',
}

// StyleSheet
const styles = ss.create({
	container: {
		// backgroundColor: 'pink', // NOTE testing flexbox
		alignSelf: 'center',
		overflow: 'hidden',
	},
	placeholder: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		justifyContent: 'center',
		alignItems: 'center',
	},
})

export default CloudinaryImage
