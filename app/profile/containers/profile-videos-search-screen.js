import React, { Component } from 'react'

import PropTypes from 'prop-types'

import R from 'ramda'
import { Actions as NavigationActions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import ProfileActions from '../actions/creator'

import common from '../../common'

const { Search } = common.components.core
const { VideosListView } = common.components.video


class ProfileVideosSearchScreen extends Component {

	state = {
		query: '',
	}

	componentWillUnmount() {
		if (this.props.results.length) this.props.clearProfileVideosSearch()
	}

	onSearch = (query) => {
		if (query.length >= 2) {
			this.props.searchProfileVideos(query)
		} else {
			if (this.props.results.length) this.props.clearProfileVideosSearch()
		}

		this.setState({
			query,
		})
	}

	render() {
		const { results, navigateToProfileVideo } = this.props
		const { query } = this.state

		return (
			<Search
				query={query}
				onSearch={this.onSearch}
			>
				{
					query
					&& results.length
					&& <VideosListView videos={results} onPress={navigateToProfileVideo} />
				}
			</Search>
		)
	}

}

ProfileVideosSearchScreen.propTypes = {
	profileType: PropTypes.oneOf(['user', 'friend']).isRequired,
	results: PropTypes.arrayOf(PropTypes.object).isRequired,
	searchProfileVideos: PropTypes.func.isRequired,
	clearProfileVideosSearch: PropTypes.func.isRequired,
	navigateToProfileVideo: PropTypes.func.isRequired,
}


// Redux mappings
const mapStateToProps = state => ({
	userId: state.user.data.member_id,
	results: state.profile.videosSearchResults,
	connectionResults: state.profile.connectionProfile.videosSearchResults,
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
		searchProfileVideos: (query) => {
			if (userId) {
				dispatch(ProfileActions.searchUserProfileVideosAttempt(query))
			} else {
				dispatch(ProfileActions.searchConnectionProfileVideosAttempt(query))
			}
		},
		clearProfileVideosSearch: () => {
			if (userId) {
				dispatch(ProfileActions.clearUserProfileVideosSearch())
			} else {
				dispatch(ProfileActions.clearConnectionProfileVideosSearch())
			}
		},
		navigateToProfileVideo: ({ media_id }) => NavigationActions.ProfileVideo({
			profileType: ownProps.profileType,
			mediaId: media_id,
		}),
	}
}

export default connect(mapStateToProps, null, mergeProps)(ProfileVideosSearchScreen)
