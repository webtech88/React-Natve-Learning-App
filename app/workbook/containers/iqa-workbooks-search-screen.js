import React, { Component } from 'react'

import { Actions as NavigationActions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import WorkbookActions from '../actions/creator'

import common from '../../common'
import IqaWorkbookListView from '../components/iqa-workbook-list-view'

const { Search } = common.components.core


class IqaWorkbooksSearchScreen extends Component {

	render() {
		const {
			query,
			workbooks,
			filterIqaWorkbooks,
			navigateToWorkbook,
		} = this.props

		return (
			<Search
				query={query}
				onSearch={text => filterIqaWorkbooks(text)}
			>
				{
					query
					&& workbooks
					&& workbooks.length
					&& <IqaWorkbookListView workbooks={workbooks} onPress={navigateToWorkbook} />
				}
			</Search>
		)
	}

}


// Redux mappings
const mapStateToProps = state => ({
	query: state.iqa.filterQuery,
	workbooks: state.iqa.filterWorkbooks,
})

const mapDispatchToProps = dispatch => ({
	filterIqaWorkbooks: (query) => {
		dispatch(WorkbookActions.filterIqaWorkbooksAttempt(query))
	},
	navigateToWorkbook: (unitId, workbookId) => {
		NavigationActions.Workbook({ unitId, workbookId })
	},
})

export default connect(mapStateToProps, mapDispatchToProps)(IqaWorkbooksSearchScreen)
