import React from 'react'
import DismissKeyboard from 'dismissKeyboard'
import { Actions as NavigationActions, Scene } from 'react-native-router-flux'
import CoreActions from '../../core/actions/creator'

import containers from '../containers'
import ss from '../../styles'
import common from '../../common'

const { images } = ss
const { NavBarTitleText, NavBarIconButton } = common.components.navigation


// Auth & SignUp
const Intro = props => (
	<Scene
		key="Intro"
		hideNavBar
		component={containers.IntroScreen}
		type="reset"
		{...props}
	/>
)

const SignIn = props => (
	<Scene
		key="SignIn"
		hideNavBar={false}
		component={containers.SignInScreen}
		type="pushOrPop"
		renderTitle={props => (
				<NavBarTitleText title="Sign In" />
			)}
		// TODO
		renderBackButton={() => (
			<NavBarIconButton
				name="back"
				onPress={() => {
					DismissKeyboard()
					NavigationActions.pop()
				}}
			/>
		)}
		{...props}
	/>
)

const SignUpWithEmail = props => (
	<Scene
		key="SignUpWithEmail"
		hideNavBar={false}
		component={containers.SignUpScreen}
		type="pushOrPop"
		renderTitle={props => (
				<NavBarTitleText title="Sign up with Email" />
			)}
		// TODO
		renderBackButton={() => (
			<NavBarIconButton
				name="back"
				onPress={() => {
					DismissKeyboard()
					NavigationActions.pop()
				}}
			/>
		)}
		{...props}
	/>
)

const ForgotPassword = props => (
	<Scene
		key="ForgotPassword"
		hideNavBar={false}
		component={containers.ForgotPasswordScreen}
		direction="vertical"
		// TODO
		renderBackButton={() => (
			<NavBarIconButton
				name="back"
				onPress={() => {
					DismissKeyboard()
					NavigationActions.pop()
				}}
			/>
		)}
		{...props}
	/>
)

const SignUpRegistration = props => (
	<Scene
		key="SignUpRegistration"
		hideNavBar
		panHandlers={null}
		component={containers.SignUpRegistrationScreen}
		type="reset"
		{...props}
	/>
)

const SignUpProfile = props => (
	<Scene
		key="SignUpProfile"
		hideNavBar
		panHandlers={null}
		component={containers.SignUpProfileScreen}
		type="pushOrPop"
		{...props}
	/>
)

// Settings
const SettingsMenu = props => (
	<Scene
		key="SettingsMenu"
		component={containers.SettingsMenuScreen}
		renderTitle={props => (
				<NavBarTitleText title="Settings" />
			)}
		renderLeftButton={() => null}
		renderRightButton={props => (
			<NavBarIconButton
				name="hamburger"
				onPress={() => props.dispatch(CoreActions.toggleDrawer(true))}
			/>
		)}
		navigationBarStyle={{ borderBottomWidth: 1 }}
		{...props}
	/>
)

const SettingsPersonalInfo = props => (
	<Scene
		key="SettingsPersonalInfo"
		hideNavBar={false}
		component={containers.SettingsPersonalInfoScreen}
		renderTitle={props => (
				<NavBarTitleText title="Personal Info" />
			)}
		navigationBarStyle={{ borderBottomWidth: 1 }}
		// TODO
		renderBackButton={() => (
			<NavBarIconButton
				name="back"
				onPress={() => {
					DismissKeyboard()
					NavigationActions.pop()
				}}
			/>
		)}
		{...props}
	/>
)

const SettingsEmail = props => (
	<Scene
		key="SettingsEmail"
		hideNavBar={false}
		component={containers.SettingsEmailScreen}
		renderTitle={props => (
				<NavBarTitleText title="Email" />
			)}
		renderBackButton={() => (
			<NavBarIconButton name="back"
				onPress={() => NavigationActions.pop()}
			/>
		)}
		navigationBarStyle={{ borderBottomWidth: 1 }}
		{...props}
	/>
)

const SettingsRegistrationCodes = props => (
	<Scene
		key="SettingsRegistrationCodes"
		hideNavBar={false}
		component={containers.SettingsRegistrationCodesScreen}
		renderTitle={props => (
				<NavBarTitleText title="Registration Codes" />
			)}
		renderBackButton={() => (
			<NavBarIconButton name="back"
				onPress={() => NavigationActions.pop()}
			/>
		)}
		navigationBarStyle={{ borderBottomWidth: 1 }}
		{...props}
	/>
)

const SettingsPassword = props => (
	<Scene
		key="SettingsPassword"
		{...props}
	>
		<Scene
			key="SettingsCurrentPassword"
			hideNavBar={false}
			component={containers.SettingsCurrentPasswordScreen}
			renderTitle={props => (
				<NavBarTitleText title="Current Password" />
			)}
			navigationBarStyle={{ borderBottomWidth: 1 }}
			renderBackButton={() => (
				<NavBarIconButton
					name="back"
					onPress={() => {
						DismissKeyboard()
						NavigationActions.pop()
					}}
				/>
			)}
			renderRightButton={() => null}
		/>
		<Scene
			key="SettingsNewPassword"
			hideNavBar={false}
			component={containers.SettingsNewPasswordScreen}
			renderTitle={props => (
				<NavBarTitleText title="New Password" />
			)}
			navigationBarStyle={{ borderBottomWidth: 1 }}
			// TODO Not working
			renderBackButton={() => (
				<NavBarIconButton
					name="back"
					onPress={() => {
						DismissKeyboard()
						NavigationActions.popTo('SettingsMenu')
					}}
				/>
			)}
			// onBack={() => {
			// 	DismissKeyboard()
			// 	NavigationActions.popTo('SettingsMenu')
			// }}
			renderRightButton={() => null}
		/>
	</Scene>
)

const SettingsPhone = props => (
	<Scene
		key="SettingsPhone"
		hideNavBar={false}
		component={containers.SettingsPhoneScreen}
		renderTitle={props => (
				<NavBarTitleText title="Phone Number" />
			)}
		navigationBarStyle={{ borderBottomWidth: 1 }}
		renderBackButton={() => (
			<NavBarIconButton
				name="back"
				onPress={() => {
					DismissKeyboard()
					NavigationActions.pop()
				}}
			/>
		)}
		{...props}
	/>
)

const SettingsSocial = props => (
	<Scene
		key="SettingsSocial"
		hideNavBar={false}
		component={containers.SettingsSocialConnectionsScreen}
		renderTitle={props => (
				<NavBarTitleText title="Social Connections" />
			)}
		navigationBarStyle={{ borderBottomWidth: 1 }}
		renderBackButton={() => (
			<NavBarIconButton
				name="back"
				onPress={() => {
					DismissKeyboard()
					NavigationActions.pop()
				}}
			/>
		)}
		{...props}
	/>
)

const SettingsNotifications = props => (
	<Scene
		key="SettingsNotifications"
		hideNavBar={false}
		component={containers.SettingsNotificationsScreen}
		renderTitle={props => (
				<NavBarTitleText title="Notifications" />
			)}
		renderBackButton={() => (
			<NavBarIconButton
				name="back"
				onPress={() => {
					NavigationActions.pop()
				}}
			/>
		)}
		navigationBarStyle={{ borderBottomWidth: 1 }}
		{...props}
	/>
)

const SettingsLegal = props => (
	<Scene
		key="SettingsLegal"
		hideNavBar={false}
		component={containers.SettingsLegalMenuScreen}
		renderTitle={props => (
				<NavBarTitleText title="Legal" />
			)}
		renderBackButton={() => (
			<NavBarIconButton
				name="back"
				onPress={() => {
					NavigationActions.pop()
				}}
			/>
		)}
		navigationBarStyle={{ borderBottomWidth: 1 }}
		{...props}
	/>
)

const SettingsLegalContent = props => (
	<Scene
		key="SettingsLegalContent"
		hideNavBar={false}
		component={containers.SettingsLegalContentScreen}
		title=""
		renderBackButton={() => (
			<NavBarIconButton
				name="back"
				onPress={() => {
					NavigationActions.pop()
				}}
			/>
		)}
		navigationBarStyle={{ borderBottomWidth: 1 }}
		{...props}
	/>
)

const SettingsAbout = props => (
	<Scene
		key="SettingsAbout"
		hideNavBar={false}
		lightStatusBarContent // custom prop
		component={containers.SettingsAboutScreen}
		renderTitle={props => (
				<NavBarTitleText titleStyle={{ color: 'white' }} title="About" />
			)}
		navigationBarStyle={{ backgroundColor: 'transparent' }}
		renderBackButton={() => (
			<NavBarIconButton
				name="back"
				color="white"
				onPress={() => {
					NavigationActions.pop()
				}}
			/>
		)}
		{...props}
	/>
)

const SettingsLanguage = props => (
	<Scene
		key="SettingsLanguage"
		hideNavBar={false}
		component={containers.SettingsLanguageScreen}
		renderTitle={props => (
				<NavBarTitleText title="Language Settings" />
			)}
		navigationBarStyle={{ backgroundColor: 'transparent' }}
		renderBackButton={() => (
			<NavBarIconButton
				name="back"
				onPress={() => {
					NavigationActions.pop()
				}}
			/>
		)}
		{...props}
	/>
)


// return all the scenes
export default {
	// Auth & SignUp
	Intro,
	SignIn,
	SignUpWithEmail,
	ForgotPassword,
	SignUpRegistration,
	SignUpProfile,
	// Settings
	SettingsMenu,
	SettingsPersonalInfo,
	SettingsEmail,
	SettingsRegistrationCodes,
	SettingsPassword,
	SettingsPhone,
	SettingsSocial,
	SettingsNotifications,
	SettingsLegal,
	SettingsLegalContent,
	SettingsAbout,
	SettingsLanguage
}
