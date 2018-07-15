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
const { PhotosCardView } = common.components.photo


class ProfilePhotosScreen extends Component {

	render() {
		const {
			profileType,
			photos,
			navigateToProfilePhoto,
			navigateToProfileAddPhoto,
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
							onPress={() => NavigationActions.ProfilePhotosSearch({ profileType })}
						/>
					)}
					navigationBarStyle={{ borderBottomWidth: 1 }}
				/>
				{R.equals('user', profileType) &&
					<View style={styles.add}>
						<Button
							label="Add"
							onPress={navigateToProfileAddPhoto}
						/>
					</View>
				}
				{photos &&
					<PhotosCardView animated photos={photos} onPress={navigateToProfilePhoto} initialListSize={21} />
				}
			</View>
		)
	}
}

ProfilePhotosScreen.propTypes = {
	profileType: PropTypes.oneOf(['user', 'friend']).isRequired,
	photos: PropTypes.arrayOf(PropTypes.object).isRequired,
	navigateToProfilePhoto: PropTypes.func.isRequired,
	navigateToProfileAddPhoto: PropTypes.func.isRequired,
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
	photos: state.profile.photos,
	connectionProfile: state.profile.connectionProfile.data,
	connectionPhotos: state.profile.connectionProfile.photos,
})

function mergeProps(stateProps, dispatchProps, ownProps) {
	let title = stateProps.connectionProfile && `${stateProps.connectionProfile.first_name}' Photos`
	let photos = stateProps.connectionPhotos

	// NOTE is current user profile?
	if (R.equals('user', ownProps.profileType)) {
		title = 'My Photos'
		photos = stateProps.photos
	}

	return {
		...ownProps,
		title,
		photos,
		navigateToProfilePhoto: ({ media_id }) => NavigationActions.ProfilePhoto({
			profileType: ownProps.profileType,
			mediaId: media_id,
		}),
		navigateToProfileAddPhoto: () => NavigationActions.ProfilePhotoForm(),
	}
}

export default connect(mapStateToProps, null, mergeProps)(ProfilePhotosScreen)
