import ImagePickerManager from 'react-native-image-picker'
import { ActionSheetIOS, Platform } from 'react-native'
import ss from '../../styles'

const DEFAULT_PICKER_OPTIONS = {
	title: null,
	mediaType: 'photo',
	quality: 0.8,
	noData: true,
}

const BUTTONS = [
	'Open Camera',
	'Choose from library',
	'Cancel',
]

const CANCEL_BUTTON_INDEX = 2

/**
 * Camera upload component, can be used either as an embedded
 * stateful element or directly, by accessing exposed static methods
 */
class ImagePicker {
  /**
   * Parses picker response, if `uri` is provided (image has been captured)
   * the subsequent promise is resolved.
   *
   * If source is missing, a promise is rejected
   */
	pickerResponseHandler: Function = (response, resolve, reject) => {
		if (response.didCancel) {
			return reject('User cancelled image picker')
		} else if (response.error) {
			return reject(response.error)
		} else if (response.uri) {
			return resolve({
				uri: Platform.OS === 'ios' ? response.origURL : response.uri,
				type: response.type,
				localUri: response.uri,
			})
		}
	}

	showImagePicker = (options = DEFAULT_PICKER_OPTIONS) => new Promise((resolve, reject) => {
		if (Platform.OS === 'ios') {
			ActionSheetIOS.showActionSheetWithOptions({
				options: BUTTONS,
				cancelButtonIndex: CANCEL_BUTTON_INDEX,
				tintColor: ss.constants.COLOR_LINK,
			},
			(buttonIndex) => {
				switch (buttonIndex) {
				case 0:
					return this.launchCamera(options)
						.then(response => this.pickerResponseHandler(response, resolve, reject))
				case 1:
					return this.showImageLibrary(options)
						.then(response => this.pickerResponseHandler(response, resolve, reject))
				default:
					return null
				}
			})
		} else {
			return ImagePickerManager.showImagePicker(options,
				(response) => {
					this.pickerResponseHandler(response, resolve, reject)
				})
		}
	})

	/**
	 * Shows image picker and returns a promise that resolves with `PickerResponse`
	 */
	showImageLibrary = options => new Promise(resolve =>
		ImagePickerManager.launchImageLibrary(options, resolve),
	)


  /**
   * Launches camera and returns a promise that resolves with `PickerResponse`
   * when image is captured
   */
	launchCamera = options => new Promise(resolve =>
		ImagePickerManager.launchCamera(options, resolve),
	)
}

export default new ImagePicker()
