import React from 'react'
import {
	View,
} from 'react-native'

import { Actions as NavigationActions, Scene } from 'react-native-router-flux'

import CoreActions from '../../core/actions/creator'
import containers from '../containers'
import common from '../../common'

import ss from '../../styles'

const { NavBarIconButton, NavBarTitleText } = common.components.navigation


const Community = props => (
	<Scene
		key="Community"
		hideNavBar={false}
		component={containers.CommunityScreen}
		renderTitle={props => (
				<NavBarTitleText title="Your Community" />
			)}
		renderLeftButton={() => (
			<View style={styles.navBarIconContainer}>
				{/* <NavBarIconButton
					key={'NavBarLeftButton_1'}
					// image={images.iconNavSearch}
					name="search"
					onPress={() => NavigationActions.CommunitySearch()}
				/>*/}
				{/* TODO: Size not right */}
				<NavBarIconButton
					key={'NavBarLeftButton_2'}
					name="settings"
					onPress={() => NavigationActions.CommunitySettings()}
				/>
			</View>
		)}
		renderRightButton={props => (
			<NavBarIconButton
				name="hamburger"
				onPress={() => props.dispatch(CoreActions.toggleDrawer(true))}
			/>
		)}
		{...props}
	/>
)

const CommunitySearch = props => (
	<Scene
		key="CommunitySearch"
		component={containers.CommunitySearchScreen}
		hideNavBar
		panHandlers={null}
		duration={1}
		direction="vertical"
		getSceneStyle={() => ({
			opacity: 1,
			transform: [],
			backgroundColor: 'transparent',
		})}
		{...props}
	/>
)

const CommunitySettings = props => (
	<Scene
		key="CommunitySettings"
		component={containers.CommunitySettingsModal}
		{...props}
	/>
)

const ConnectionInfo = props => (
	<Scene
		key="ConnectionInfo"
		component={containers.ConnectionInfoScreen}
		hideNavBar
		lightStatusBarContent // custom prop
		disableDrawerPanOpen // custom prop
		panHandlers={null}
		direction="vertical"
		{...props}
	/>
)

// StyleSheet
const {
	navBar: { navBarIconContainer },
} = ss

const styles = ss.create({
	navBarIconContainer: {
		...navBarIconContainer,
	},
})

export default {
	Community,
	CommunitySearch,
	CommunitySettings,
	ConnectionInfo,
}
