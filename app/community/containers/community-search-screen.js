import React, { Component } from 'react'

import { Actions as NavigationActions } from 'react-native-router-flux'
import { connect } from 'react-redux'

import common from '../../common'
import CommunityActions from '../actions/creator'

const { CommunityListView, Search } = common.components.core


class CommunitySearchScreen extends Component {
	state = {
		query: '',
	}

	onSearch = (query) => {
		if (query.length >= 3) {
			this.props.searchCommunity(query)
		} else {
			if (this.props.results.length) this.props.clearCommunitySearch()
		}

		this.setState({
			query,
		})
	}

	render() {
		const { navigateToConnectionProfile, results } = this.props
		const { query } = this.state

		return (
			<Search
				query={query}
				onSearch={this.onSearch}
			>
				{
					query
					&& results.length
					&& <CommunityListView animated={false} contacts={results} onPress={navigateToConnectionProfile} />
				}
			</Search>
		)
	}

}

// Redux mappings
const mapStateToProps = state => ({
	results: state.community.searchResults,
})

const mapDispatchToProps = dispatch => ({
	searchCommunity: phrase => dispatch(CommunityActions.searchCommunityAttempt(phrase)),
	clearCommunitySearch: () => dispatch(CommunityActions.clearCommunitySearch()),
	navigateToConnectionProfile: (connection) => {
		if (connection.member_id && connection.status) {
			if (connection.status === 'friend') {
				NavigationActions.ConnectionProfile({ memberId: connection.member_id })
			} else {
				dispatch(CommunityActions.setActiveConnectionId(connection.member_id))
			}
		}
	},
})

export default connect(mapStateToProps, mapDispatchToProps)(CommunitySearchScreen)
