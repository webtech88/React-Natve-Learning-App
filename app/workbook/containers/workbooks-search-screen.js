import React, { Component } from 'react'

import PropTypes from 'prop-types'

import R from 'ramda'

import { Actions as NavigationActions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import WorkbookActions from '../actions/creator'

import common from '../../common'
import WorkbookListView from '../components/workbook-list-view'

const { Search } = common.components.core
const getRandomId = () => Math.random().toString(36).substr(2, 10)


class WorkbooksSearchScreen extends Component {

	componentWillUnmount() {
		this.props.setSearchQuery('')
	}

	onSearch = (query) => {
		this.props.setSearchQuery(query)
	}

	render() {
		const { query, results, navigateToWorkbookInfo } = this.props

		return (
			<Search
				query={query}
				onSearch={this.onSearch}
			>
				{
					query
					&& results
					&& results.length
					&& (
						<WorkbookListView
							visible
							animated={false}
							workbooks={results}
							onPress={navigateToWorkbookInfo}
						/>
					)
				}
			</Search>
		)
	}

}

WorkbooksSearchScreen.propTypes = {
	query: PropTypes.string.isRequired,
	results: PropTypes.array,
	setSearchQuery: PropTypes.func.isRequired,
	navigateToWorkbookInfo: PropTypes.func.isRequired,
}

WorkbooksSearchScreen.defaultProps = {
	results: null,
}


// Redux mappings
const getFilteredWorkbooks = createSelector(
	state => state.data,
	state => state.activeQualificationId,
	state => state.searchQuery,
	(data, qualificationId, query) => (
		(data && data[qualificationId])
		? R.filter(R.pipe(
			R.props(['unit_id', 'workbook_id', 'workbook_reference', 'reference', 'title']),
			R.any(R.pipe(R.toString, R.toLower, str => str.includes(query.toLowerCase()))),
		))(data[qualificationId].workbooks)
		: null
	),
)

const mapStateToProps = state => ({
	query: state.qualifications.searchQuery,
	results: getFilteredWorkbooks(state.qualifications),
})

const mapDispatchToProps = dispatch => ({
	setSearchQuery: query => dispatch(WorkbookActions.setWorkbooksSearchQuery(query)),
	navigateToWorkbookInfo: (workbook) => {
		NavigationActions.WorkbookInfo({ workbook })
	},
})

export default connect(mapStateToProps, mapDispatchToProps)(WorkbooksSearchScreen)
