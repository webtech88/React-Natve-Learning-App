import React, { Component } from 'react'
import {
	RefreshControl,
	View,
} from 'react-native'

import { Actions as NavigationActions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import WorkbookActions from '../actions/creator'
import common from '../../common'

import ss from '../../styles'

import IqaWorkbookListView from '../components/iqa-workbook-list-view'

const { Loading } = common.components.core


class IqaWorkbooksScreen extends Component {

	constructor(props) {
		super(props)

		this.state = {
			refreshing: false,
		}
	}

	componentDidMount() {
		this.props.getIqaWorkbooks()
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.workbooks !== nextProps.workbooks) {
			this.setState({ refreshing: false })
		}
	}

	onRefresh = () => {
		this.setState({ refreshing: true })
		this.props.getIqaWorkbooks()
	}

	render() {
		const { gettingWorkbooks, workbooks, navigateToWorkbook } = this.props

		if (workbooks) {
			return (
				<View style={styles.wrapper}>
					<IqaWorkbookListView
						workbooks={workbooks}
						onPress={navigateToWorkbook}
						enableEmptySections
						initialListSize={10}
						scrollRenderAheadDistance={200}
						refreshControl={
							<RefreshControl
								refreshing={this.state.refreshing}
								onRefresh={this.onRefresh}
							/>
						}
					/>
				</View>
			)
		}

		return <Loading style={{ marginTop: ss.constants.HEIGHT_NAV_BAR }} message="Loading workbooks..." />
	}

}


// StyleSheet
const {
	base: { wrapper },
} = ss

const styles = ss.create({
	wrapper: {
		...wrapper,
		// backgroundColor: 'gray', // NOTE testing flexbox
	},
})


// Redux mappings
const mapStateToProps = state => ({
	gettingWorkbooks: state.iqa.gettingWorkbooks,
	workbooks: state.iqa.workbooks,
})

const mapDispatchToProps = dispatch => ({
	getIqaWorkbooks: () => {
		dispatch(WorkbookActions.getIqaWorkbooksAttempt())
	},
	navigateToWorkbook: (unitId, workbookId) => {
		NavigationActions.Workbook({ unitId, workbookId })
	},
})

export default connect(mapStateToProps, mapDispatchToProps)(IqaWorkbooksScreen)
