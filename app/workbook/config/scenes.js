import React from 'react'
import { View } from 'react-native'
import { Actions as NavigationActions, Scene } from 'react-native-router-flux'
import CoreActions from '../../core/actions/creator'
import WorkbookActions from '../actions/creator'

import containers from '../containers'

import ss from '../../styles'
import common from '../../common'

const { size, images } = ss
const {
	NavBarIconButton,
	NavBarTitleSegmentedControl,
	NavBarTitleText,
} = common.components.navigation

const Dashboard = props => (
	<Scene
		key="Dashboard"
		component={containers.DashboardScreen}
		renderTitle={props => (
				<NavBarTitleText 
					title="Dashboard" 
					titleStyle={{ color: 'white' }}
				/>
			)}
		renderBackButton={() => null}
		renderRightButton={props => (
			<NavBarIconButton
				name="hamburger"
				color="white"
				onPress={() => props.dispatch(CoreActions.toggleDrawer(true))}
			/>
		)}
		navigationBarStyle={{ backgroundColor: 'transparent' }}
		lightStatusBarContent // custom prop
		{...props}
	/>
)

const Qualifications = props => (
	<Scene
		key="Qualifications"
		component={containers.QualificationsScreen}
		hideNavBar={false}
		disableDrawerPanOpen // custom prop
		renderTitle={props => (
				<NavBarTitleText title="Qualifications" />
			)}
		getSceneStyle={props => ({
			opacity: 1,
			transform: [],
		})}
		renderBackButton={() => null}
		renderRightButton={props => (
			<NavBarIconButton
				name="hamburger"
				onPress={() => props.dispatch(CoreActions.toggleDrawer(true))}
			/>
		)}
		{...props}
	/>
)

const QualificationWorkbooks = props => (
	<Scene
		key="QualificationWorkbooks"
		component={containers.WorkbooksScreen}
		title="Workbooks"
		activeTabIndex={0} // custom prop
		disableDrawerPanOpen // custom prop
		panHandlers={null}
		hideNavBar={false}
		getSceneStyle={props => ({
			backgroundColor: 'transparent',
		})}
		navigationBarStyle={{ borderBottomWidth: 1 }}
		renderBackButton={props => (
			<NavBarIconButton
				name="back"
				onPress={() => {
					props.dispatch(WorkbookActions.unsetActiveQualificationId())
				}}
			/>
		)}
		// onBack={props => props.dispatch(WorkbookActions.unsetActiveQualificationId())}
		renderTitle={(props) => {
			const { activeTabIndex } = props

			return (
				<NavBarTitleSegmentedControl
					segments={['Cover', 'List']}
					selectedIndex={activeTabIndex}
					onPress={(index) => {
						if (index === 0) {
							NavigationActions.WorkbooksSwiper()
						} else {
							NavigationActions.WorkbooksList()
						}
					}}
				/>
			)
		}}
		// TODO
		renderRightButton={() => (
			<NavBarIconButton name="search"
				onPress={() => NavigationActions.WorkbooksSearch()}
			/>
		)}
		{...props}
	>
		{/* NOTE example of using sub-scenes */}
		<Scene key="WorkbooksSwiper" />
		<Scene
			key="WorkbooksList"
			activeTabIndex={1} // custom prop
		/>
	</Scene>
)

const WorkbooksSearch = props => (
	<Scene
		key="WorkbooksSearch"
		component={containers.WorkbooksSearchScreen}
		hideNavBar
		panHandlers={null}
		duration={1}
		direction="vertical"
		getSceneStyle={props => ({
			opacity: 1,
			transform: [],
			backgroundColor: 'transparent',
		})}
		{...props}
	/>
)

const WorkbookInfo = props => (
	<Scene
		key="WorkbookInfo"
		component={containers.WorkbookInfoScreen}
		hideNavBar
		hideStatusBar // custom prop
		{...props}
	/>
)

const Workbook = props => (
	<Scene
		key="Workbook"
		// title="Workbook Preview"
		component={containers.WorkbookScreen}
		direction="vertical"
		panHandlers={null}
		disableDrawerPanOpen // custom prop
		// navigationBarStyle={{ borderBottomWidth: 1 }}
		{...props}
	/>
)

const Activity = props => (
	<Scene
		key="Activity"
		// title="Activity"
		component={containers.ActivityScreen}
		direction="vertical"
		hideNavBar
		panHandlers={null}
		disableDrawerPanOpen // custom prop
		{...props}
	/>
)

// NOTE this is for IQA/Admins only
const IqaWorkbooks = props => (
	<Scene
		key="IqaWorkbooks"
		renderTitle={props => (
				<NavBarTitleText title="All Workbooks" />
			)}
		component={containers.IqaWorkbooksScreen}
		hideNavBar={false}
		renderLeftButton={() => (
			<View style={styles.navBarIconContainer}>
				<NavBarIconButton
					key={'NavBarLeftButton_1'}
					// image={images.iconNavSearch}
					name="search"
					onPress={() => NavigationActions.IqaWorkbooksSearch()}
				/>
				<NavBarIconButton
					key={'NavBarLeftButton_2'}
					style={{ marginLeft: size(15) }}
					// image={images.iconNavSettings}
					name="settings"
					onPress={() => NavigationActions.IqaWorkbooksSettings()}
				/>
			</View>
		)}
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

const IqaWorkbooksSearch = props => (
	<Scene
		key="IqaWorkbooksSearch"
		component={containers.IqaWorkbooksSearchScreen}
		hideNavBar
		panHandlers={null}
		duration={1}
		direction="vertical"
		getSceneStyle={props => ({
			opacity: 1,
			transform: [],
			backgroundColor: 'transparent',
		})}
	/>
)

const IqaWorkbooksSettings = props => (
	<Scene
		key="IqaWorkbooksSettings"
		component={containers.IqaWorkbooksSettingsModal}
		{...props}
	/>
)
// End of IQA/Admins

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
	Dashboard,
	Qualifications,
	QualificationWorkbooks,
	WorkbooksSearch,
	WorkbookInfo,
	Workbook,
	Activity,
	IqaWorkbooks,
	IqaWorkbooksSearch,
	IqaWorkbooksSettings,
}
