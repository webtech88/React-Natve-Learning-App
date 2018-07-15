import React from 'react'
import { Scene } from 'react-native-router-flux'
import containers from '../containers'
import common from '../../common'


const { NavBarTitleText } = common.components.navigation

// Profile
const profileProps = {
	component: containers.ProfileScreen,
	hideNavBar: true,
	panHandlers: null,
	lightStatusBarContent: true, // custom prop
	disableDrawerPanOpen: true, // custom prop
	title: '',
}

const UserProfile = props => (
	<Scene
		key="UserProfile"
		profileType="user" // custom prop
		memberId={0} // custom prop
		{...profileProps}
		{...props}
	/>
)

const ConnectionProfile = props => (
	<Scene
		key="ConnectionProfile"
		profileType="friend" // custom prop
		direction="vertical"
		{...profileProps}
		{...props}
	/>
)

const ProfilePhotos = props => (
	<Scene
		key="ProfilePhotos"
		renderTitle={props => (
				<NavBarTitleText title="My Photos" />
			)}
		component={containers.ProfilePhotosScreen}
		direction="vertical"
		panHandlers={null}
		hideNavBar
		customNavBar // custom prop
		{...props}
	/>
)

const ProfilePhotosSearch = props => (
	<Scene
		key="ProfilePhotosSearch"
		component={containers.ProfilePhotosSearchScreen}
		hideNavBar
		panHandlers={null}
		duration={1}
		direction="vertical"
		{...props}
	/>
)

const ProfilePhoto = props => (
	<Scene
		key="ProfilePhoto"
		component={containers.ProfilePhotoScreen}
		hideNavBar
		hideStatusBar // custom prop
		direction="vertical"
		panHandlers={null}
		{...props}
	/>
)

const ProfilePhotoForm = props => (
	<Scene
		key="ProfilePhotoForm"
		title=""
		component={containers.ProfilePhotoFormScreen}
		direction="vertical"
		panHandlers={null}
		hideNavBar
		hideStatusBar // custom prop
		{...props}
	/>
)

const ProfileVideos = props => (
	<Scene
		key="ProfileVideos"
		renderTitle={props => (
				<NavBarTitleText title="My Videos" />
			)}
		component={containers.ProfileVideosScreen}
		direction="vertical"
		panHandlers={null}
		hideNavBar
		customNavBar // custom prop
		{...props}
	/>
)

const ProfileVideosSearch = props => (
	<Scene
		key="ProfileVideosSearch"
		component={containers.ProfileVideosSearchScreen}
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

const ProfileVideo = props => (
	<Scene
		key="ProfileVideo"
		component={containers.ProfileVideoScreen}
		hideNavBar
		hideStatusBar // custom prop
		direction="vertical"
		panHandlers={null}
		{...props}
	/>
)

const ProfileVideoForm = props => (
	<Scene
		key="ProfileVideoForm"
		title=""
		component={containers.ProfileVideoFormScreen}
		direction="vertical"
		panHandlers={null}
		hideNavBar
		hideStatusBar // custom prop
		{...props}
	/>
)

const ProfileExperience = props => (
	<Scene
		key="ProfileExperience"
		renderTitle={props => (
				<NavBarTitleText title="My Experience" />
			)}
		component={containers.ProfileExperienceScreen}
		direction="vertical"
		panHandlers={null}
		hideNavBar
		customNavBar // custom prop
		{...props}
	/>
)

const ProfileEducation = props => (
	<Scene
		key="ProfileEducation"
		renderTitle={props => (
				<NavBarTitleText title="My Education" />
			)}
		component={containers.ProfileEducationScreen}
		direction="vertical"
		panHandlers={null}
		hideNavBar
		customNavBar // custom prop
		{...props}
	/>
)

const ProfileBioForm = props => (
	<Scene
		key="ProfileBioForm"
		title=""
		component={containers.ProfileBioFormScreen}
		hideNavBar
		customNavBar // custom prop
		{...props}
	/>
)

const ProfileReferences = props => (
	<Scene
		key="ProfileReferences"
		renderTitle={props => (
				<NavBarTitleText title="My References" />
			)}
		component={containers.ProfileReferencesScreen}
		direction="vertical"
		panHandlers={null}
		hideNavBar
		customNavBar // custom prop
		{...props}
	/>
)

const ProfileReferenceForm = props => (
	<Scene
		key="ProfileReferenceForm"
		renderTitle={props => (
				<NavBarTitleText title="Add Reference" />
			)}
		component={containers.ProfileReferenceFormScreen}
		direction="vertical"
		panHandlers={null}
		hideStatusBar // custom prop
		hideNavBar
		customNavBar // custom prop
		{...props}
	/>
)

// return all the scenes
export default {
	// Profile
	UserProfile,
	ConnectionProfile,
	ProfilePhotos,
	ProfilePhotosSearch,
	ProfilePhoto,
	ProfilePhotoForm,
	ProfileVideos,
	ProfileVideosSearch,
	ProfileVideo,
	ProfileVideoForm,
	ProfileExperience,
	ProfileEducation,
	ProfileBioForm,
	ProfileReferences,
	ProfileReferenceForm,
}
