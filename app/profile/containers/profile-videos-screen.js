import React, { Component } from 'react'
import {
	View,
} from 'react-native'

import PropTypes from 'prop-types'

import R from 'ramda'
import { Actions as NavigationActions } from 'react-native-router-flux'
import { connect } from 'react-redux'

import ss from '../../styles'
import common from '../../common'

const { NavBar, NavBarIconButton } = common.components.navigation
const { Button } = common.components.core
const { VideosListView } = common.components.video


class ProfileVideosScreen extends Component {

	render() {
		const {
			profileType,
			videos,
			navigateToProfileVideo,
			navigateToProfileAddVideo,
		} = this.props

		return (
			<View style={styles.wrapper}>
				<NavBar
					title={this.props.title}
					renderLeftButton={() => (
						<NavBarIconButton
							name="cancel"
							onPress={() => NavigationActions.pop()}
						/>
					)}
					renderRightButton={() => (
						<NavBarIconButton
							name="search"
							onPress={() => NavigationActions.ProfileVideosSearch({ profileType })}
						/>
					)}
					navigationBarStyle={{ borderBottomWidth: 1 }}
				/>
				{R.equals('user', profileType) &&
					<View style={styles.add}>
						<Button
							label="Add"
							onPress={navigateToProfileAddVideo}
						/>
					</View>
				}
				{videos &&
					<VideosListView videos={videos} onPress={navigateToProfileVideo} />
				}
			</View>
		)
	}
}

ProfileVideosScreen.propTypes = {
	profileType: PropTypes.oneOf(['user', 'friend']).isRequired,
	videos: PropTypes.arrayOf(PropTypes.object).isRequired,
	navigateToProfileVideo: PropTypes.func.isRequired,
	navigateToProfileAddVideo: PropTypes.func.isRequired,
}


// StyleSheet
const {
	size,
	base: { wrapper },
} = ss

const styles = ss.create({
	wrapper: {
		...wrapper,
		// backgroundColor: 'pink', // NOTE testing flexbox
	},
	add: {
		backgroundColor: '#F9F9F9',
		padding: size(20),
		borderBottomWidth: 1,
		borderColor: 'rgba(0, 0, 0, .1)',
	},
})


// Redux mappings
const mapStateToProps = state => ({
	videos: state.profile.videos,
	connectionProfile: state.profile.connectionProfile.data,
	connectionVideos: state.profile.connectionProfile.videos,
})

function mergeProps(stateProps, dispatchProps, ownProps) {
	let title = stateProps.connectionProfile && `${stateProps.connectionProfile.first_name}' Videos`
	let videos = stateProps.connectionVideos

	// NOTE is current user profile?
	if (R.equals('user', ownProps.profileType)) {
		title = 'My Videos'
		videos = stateProps.videos
	}

	return {
		...ownProps,
		title,
		videos,
		navigateToProfileVideo: ({ media_id }) => NavigationActions.ProfileVideo({
			profileType: ownProps.profileType,
			mediaId: media_id,
		}),
		navigateToProfileAddVideo: () => NavigationActions.ProfileVideoForm(),
	}
}

export default connect(mapStateToProps, null, mergeProps)(ProfileVideosScreen)
