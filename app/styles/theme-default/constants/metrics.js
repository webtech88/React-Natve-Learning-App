import { Dimensions, Platform, StatusBar, NativeModules } from 'react-native'

import helpers from '../helpers'

const { size } = helpers
const { StatusBarManager } = NativeModules
const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window')

let StatusBarHeight = 20

if (Platform.OS === 'ios') {
	try {
		StatusBarManager.getHeight(
    (statusBarFrameData) => {
	StatusBarHeight = statusBarFrameData.height
},
  )
	} catch (e) {

	}
} else if (Platform.OS === 'android') {
	// TODO not confident about this...
	StatusBarHeight = StatusBar.currentHeight
}

export const WIDTH_DEVICE = deviceWidth
export const HEIGHT_DEVICE = deviceHeight

export const HEIGHT_STATUS_BAR = StatusBarHeight
export const HEIGHT_NAV_BAR = 44 + HEIGHT_STATUS_BAR
export const WIDTH_NAV_BAR_TITLE = 220

export const HEIGHT_SEGMENTED_CONTROL = size(46)
export const HEIGHT_KEYBOARD = 216 // NOTE ios only?

// Button
export const WIDTH_BUTTON_SMALL = size(90)
export const HEIGHT_BUTTON_SMALL = size(32)
// NOTE export const WIDTH_BUTTON_LARGE = 100; large button is full width
export const HEIGHT_BUTTON_LARGE = size(54)
