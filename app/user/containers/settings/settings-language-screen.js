import React, { Component } from 'react'
import { ScrollView, View } from 'react-native'

import { Actions as NavigationActions } from 'react-native-router-flux'
import { connect } from 'react-redux'

import CoreActions from '../../../core/actions/creator'
import SettingsMenuItem from '../../components/settings/settings-menu-item'
import common from '../../../common'

import ss from '../../../styles'
import lang from '../../../core/config/lang'

const { RadioField } = common.components.form
const { getSettingOptions, TransText } = lang


class SettingsLanguageScreen extends Component {

	render() {

		const { setLanguage, locale } = this.props
		const radioProps = {
			input: {
				value: locale,
				onChange: value => setLanguage(value)
			},
			meta: {},
			label: 'Language',
			name: 'Name',
			editable: true,
			labelColor: 'white',
			options: getSettingOptions(),
		}

		return (
			<View style={styles.wrapper}>
				<ScrollView
					contentContainerStyle={styles.viewMenu}
					showsVerticalScrollIndicator={false}
					directionalLockEnabled
				>
					<RadioField {...radioProps} />
				</ScrollView>
			</View>
		)
	}
}


// StyleSheet
const {
	size,
	base: { wrapper },
	typo: { h2, p },
} = ss

const styles = ss.create({
	wrapper: {
		...wrapper,
	},
	viewMenu: {
		paddingBottom: size(20),
	},
	divider: {
		height: 0,
		borderColor: 'rgba(0, 0, 0, 0.1)',
		borderBottomWidth: 1,
	},
})

const mapStateToProps = state => ({
	locale: state.app.locale
})

const mapDispatchToProps = dispatch => ({
  setLanguage: (locale) => {
		dispatch(CoreActions.setLanguage(locale))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(SettingsLanguageScreen)