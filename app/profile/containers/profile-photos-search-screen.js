import React, { Component } from 'react'

import PropTypes from 'prop-types'

import R from 'ramda'
import { Actions as NavigationActions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import ProfileActions from '../actions/creator'

import common from '../../common'

const { Search } = common.components.core
const { PhotosCardView } = common.components.photo


class ProfilePhotosSearchScreen extends Component {

	state = {
		query: '',
	}

	componentWillUnmount() {
		if (this.props.results.length) this.props.clearProfilePhotosSearch()
	}

	onSearch = (query) => {
		if (query.length >= 2) {
			this.props.searchProfilePhotos(query)
		} else {
			if (this.props.results.length) this.props.clearProfilePhotosSearch()
		}

		this.setState({
			query,
		})
	}

	render() {
		const { results, navigateToProfilePhoto } = this.props
		const { query } = this.state

		return (
			<Search
				query={query}
				onSearch={this.onSearch}
			>
				{
					query
					&& results.length
					&& <PhotosCardView photos={results} onPress={navigateToProfilePhoto} />
				}
			</Search>
		)
	}

}

ProfilePhotosSearchScreen.propTypes = {
	profileType: PropTypes.oneOf(['user', 'friend']).isRequired,
	results: PropTypes.arrayOf(PropTypes.object).isRequired,
	searchProfilePhotos: PropTypes.func.isRequired,
	clearProfilePhotosSearch: PropTypes.func.isRequired,
	navigateToProfilePhoto: PropTypes.func.isRequired,
}


// Redux mappings
const mapStateToProps = state => ({
	userId: state.user.data.member_id,
	results: state.profile.photosSearchResults,
	connectionResults: state.profile.connectionProfile.photosSearchResults,
})

function mergeProps(stateProps, dispatchProps, ownProps) {
	const { dispatch } = dispatchProps
	let userId
	let results = stateProps.connectionResults

	// NOTE is current user profile?
	if (R.equals('user', ownProps.profileType)) {
		userId = stateProps.userId
		results = stateProps.results
	}

	return {
		...ownProps,
		results,
		searchProfilePhotos: (query) => {
			if (userId) {
				dispatch(ProfileActions.searchUserProfilePhotosAttempt(query))
			} else {
				dispatch(ProfileActions.searchConnectionProfilePhotosAttempt(query))
			}
		},
		clearProfilePhotosSearch: () => {
			if (userId) {
				dispatch(ProfileActions.clearUserProfilePhotosSearch())
			} else {
				dispatch(ProfileActions.clearConnectionProfilePhotosSearch())
			}
		},
		navigateToProfilePhoto: ({ media_id }) => NavigationActions.ProfilePhoto({
			profileType: ownProps.profileType,
			mediaId: media_id,
		}),
	}
}

export default connect(mapStateToProps, null, mergeProps)(ProfilePhotosSearchScreen)
