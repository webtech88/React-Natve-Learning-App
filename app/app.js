// TODO ?
// import Secrets from 'react-native-config'
import React, { Component } from 'react'
import { Platform, NativeModules } from 'react-native'

import { delayConfiguration } from 'pusher-redux/react-native'

import DebugSettings from './core/config/debug-settings'
import Root from './core/containers/root-container'

import config from './core/config/app-config'

import configureStore from './core/config/store'

const store = configureStore()
const { UIManager } = NativeModules

delayConfiguration(store, config.pusherAppId, config.pusherOptions)

class App extends Component {

	constructor() {
		super()

		if (Platform.OS === 'android') {
			UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true)
		}
	}

	componentWillMount() {
		console.disableYellowBox = !DebugSettings.yellowBox
	}

	shouldComponentUpdate(nextProps, nextState) {
		return false
	}

	render() {
		return (
			<Root {...this.props} store={store} />
		)
	}

}

export default App
