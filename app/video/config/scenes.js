import React from 'react'
import { Actions as NavigationActions, Scene } from 'react-native-router-flux'
import CoreActions from '../../core/actions/creator'

import containers from '../containers'

// import common from '../../common'
import ss from '../../styles'
import common from '../../common'

const { images } = ss
const { NavBarTitleText } = common.components.navigation

const { NavBarIconButton } = common.components.navigation
// const { NavBarTitleSegmentedControl } = common.components.navigation

const Videos = props => (
	<Scene
		key="Videos"
		component={containers.VideosScreen}
		renderTitle={props => (
				<NavBarTitleText titleStyle={{ color: 'white' }} title="Featured Videos" />
			)}
		lightStatusBarContent // custom prop
		lightSegmentedControl // custom prop
		disableDrawerPanOpen // custom prop
		activeTabIndex={0} // custom prop
		navigationBarStyle={{ backgroundColor: 'transparent' }}
		renderLeftButton={() => (
			<NavBarIconButton name="search"
				color="white"
				onPress={() => NavigationActions.VideosSearch()}
			/>
		)}
		// leftButtonImage={images.iconNavSearchWhite}
		// onLeft={() => NavigationActions.VideosSearch()}
		titleStyle={{ color: 'white' }}
		// TODO
		// renderTitle={(props) => {
		// 	const { lightSegmentedControl, activeTabIndex } = props
		//
		// 	return (
		// 		<NavBarTitleSegmentedControl
		// 			lightSegmentedControl={lightSegmentedControl}
		// 			segments={['Featured', 'My Videos']}
		// 			selectedIndex={activeTabIndex}
		// 			onPress={(index) => {
		// 				if (index === 0) {
		// 					NavigationActions.VideosFeatured()
		// 				} else {
		// 					NavigationActions.VideosMyVideos()
		// 				}
		// 			}}
		// 		/>
		// 	)
		// }}
		renderRightButton={props => (
			<NavBarIconButton
				name="hamburger"
				color="white"
				onPress={() => props.dispatch(CoreActions.toggleDrawer(true))}
			/>
		)}
		{...props}
	>
		{/* NOTE example of using sub-scenes */}
		<Scene key="VideosFeatured" />
		{/* TODO <Scene
			key="VideosMyVideos"
			lightStatusBarContent={false} // custom prop
			lightSegmentedControl={false} // custom prop
			disableDrawerPanOpen={false} // custom prop
			activeTabIndex={1} // custom prop
			navigationBarStyle={{ backgroundColor: 'white' }}
			leftButtonImage={images.iconNavSearch}
			rightButtonImage={images.iconNavHamburger}
		/> */}
	</Scene>
)

const VideosSearch = props => (
	<Scene
		key="VideosSearch"
		component={containers.VideosSearchScreen}
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

const Video = props => (
	<Scene
		key="Video"
		component={containers.VideoScreen}
		hideNavBar
		hideStatusBar // custom prop
		direction="vertical"
		panHandlers={null}
		{...props}
	/>
)

export default {
	Videos,
	VideosSearch,
	Video,
}
