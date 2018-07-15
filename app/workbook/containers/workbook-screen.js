import React, { Component } from 'react'
import {
	View,
} from 'react-native'

import PropTypes from 'prop-types'

import R from 'ramda'
import { Actions as NavigationActions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import WorkbookActions from '../actions/creator'

import ss from '../../styles'
import common from '../../common'
import WorkbookRenderer from '../components/workbook/workbook-renderer'

const { NavBar, NavBarIconButton } = common.components.navigation
const { Loading, NoResults } = common.components.core


class WorkbookScreen extends Component {

	state = {
		title: ['Workbook Chapter', ' ', '1'],
		workbook: null,
		activities: null,
		showOnly: null,
		showChapters: false,
	}

	componentDidMount() {
		this.props.getWorkbook()
	}

	componentWillReceiveProps(nextProps) {
		const { workbook, activities } = nextProps

		if (nextProps.workbook !== null) {
			this.setState({ workbook, activities })
		}
	}

	componentWillUnmount() {
		this.props.unsetWorkbook()
	}

	toggleShowChapters = () => {
		const { showChapters } = this.state
		this.setState({ showChapters: !showChapters })
	}

	render() {
		const { mode, gettingWorkbook, getWorkbook, navigateToActivity } = this.props
		const { title, workbook, activities, showOnly, showChapters } = this.state
		let navBarProps
		let rendered = null

		if (workbook) {
			navBarProps = {
				renderRightButton: () => (
					<View style={{ flexDirection: 'row' }}>
						{
							!showOnly && (
								<NavBarIconButton name="chapters"
									size={ss.size(18)}
									onPress={this.toggleShowChapters}
								/>
							)
						}
						{
							R.equals('preview', mode) &&
								(showOnly || (activities && activities.length > 0)) && (
									<NavBarIconButton
										name="workbook-activity"
										size={ss.size(21)}
										style={{ marginLeft: ss.size(10) }}
										onPress={() => this.setState({
											showOnly: showOnly ? null : ['atomic', 'ACTIVITY'],
										})}
									/>
							)
						}
					</View>
				),
			}

			rendered = (
				<WorkbookRenderer
					mode={mode}
					workbook={workbook}
					activities={activities}
					showOnly={showOnly}
					showChapters={showChapters}
					toggleShowChapters={this.toggleShowChapters}
					onChapterChange={chapter => this.setState({ title: ['Workbook Chapter', ' ', chapter + 1] })}
					onRefresh={getWorkbook}
					onOpenActivity={navigateToActivity}
				/>
			)
		} else if (gettingWorkbook) {
			rendered = <Loading message="Loading workbook..." />
		} else {
			rendered = <NoResults message="Workbook not available" />
		}

		return (
			<View style={styles.wrapper}>
				<NavBar
					title={title}
					navigationBarStyle={{ borderBottomWidth: 1 }}
					renderLeftButton={() => (
						<NavBarIconButton
							name="cancel"
							onPress={() => NavigationActions.pop()}
						/>
					)}
					// leftButtonImage={ss.images.iconNavClose}
					// onLeft={NavigationActions.pop}
					// rightButtonImage={ss.images.iconNavActivities} // TODO: Set image
					// onRight={this.toggleShowChapters}
					{...navBarProps}
				/>
				{rendered}
			</View>
		)
	}

}

WorkbookScreen.propTypes = {
	mode: PropTypes.oneOf(['preview', 'learn']), // NOTE 'assess' for later
	memberId: PropTypes.number,
	unitId: PropTypes.number,
	workbookId: PropTypes.number.isRequired,
	gettingWorkbook: PropTypes.bool.isRequired,
	getWorkbook: PropTypes.func.isRequired,
	unsetWorkbook: PropTypes.func.isRequired,
	navigateToActivity: PropTypes.func.isRequired,
}

WorkbookScreen.defaultProps = {
	mode: 'learn',
	memberId: 0,
	unitId: 0,
}


// StyleSheet
const {
	base: { wrapper },
} = ss

const styles = ss.create({
	wrapper: {
		...wrapper,
		// backgroundColor: 'gray', // NOTE testing flexbox
		position: 'relative',
	},
})


// Redux mappings
const mapStateToProps = state => ({
	gettingWorkbook: state.workbook.gettingWorkbook,
	workbook: state.workbook.data,
	activities: state.workbook.activities,
})

function mergeProps(stateProps, dispatchProps, ownProps) {
	const { dispatch } = dispatchProps
	const { memberId, unitId, workbookId } = ownProps
	let mode = 'learn'

	if (unitId) mode = 'preview'

	return {
		...ownProps,
		...stateProps,
		mode,
		getWorkbook: () => {
			if (R.equals('learn', mode)) {
				dispatch(WorkbookActions.getWorkbookAttempt(memberId, workbookId))
			} else {
				dispatch(WorkbookActions.getIqaWorkbookAttempt(unitId, workbookId))
			}
		},
		unsetWorkbook: () => {
			dispatch(WorkbookActions.unsetWorkbook())
		},
		navigateToActivity: (activityId, activityCode) => {
			if (R.equals('learn', mode)) {
				NavigationActions.Activity({ mode, memberId, activityId })
			} else {
				NavigationActions.Activity({ mode, unitId, workbookId, activityCode })
			}
		},
	}
}

export default connect(mapStateToProps, null, mergeProps)(WorkbookScreen)
