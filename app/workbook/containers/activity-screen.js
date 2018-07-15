import React, { Component } from 'react'
import {
	View,
	InteractionManager,
	Alert,
} from 'react-native'

import PropTypes from 'prop-types'

import R from 'ramda'
import { Actions as NavigationActions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import { reduxForm, SubmissionError } from 'redux-form'

import common from '../../common'
import CoreActions from '../../core/actions/creator'
import WorkbookActions from '../actions/creator'

// Activities
import AreaActivity from '../components/activity/area-activity'
import MultipleTextActivity from '../components/activity/multiple-text-activity'
import FreeTextActivity from '../components/activity/free-text-activity'
import DragActivity from '../components/activity/drag-activity'
import UploadActivity from '../components/activity/upload-activity'
import MultipleChoiceActivity from '../components/activity/multiple-choice-activity'

import ss from '../../styles'

const { NavBar, NavBarIconButton } = common.components.navigation
const { Loading, NoResults } = common.components.core

class ActivityScreen extends Component {
	componentDidMount() {
		InteractionManager.runAfterInteractions(() => {
			this.props.getWorkbookActivity()
		})
	}

	componentWillUnmount() {
		this.props.unsetActivity()
	}

	renderActivity = (activity) => {
		const {
			userId,
			mode,
			savingActivity,
			submittingActivity,
			submitted,
			approved,
			initialValues,
			change,
			handleSubmit,
			saveActivity,
			submitActivity,
			activeField,
			reset,
		} = this.props
		let canModify = true
		let canSubmit = true

		if (R.equals('learn', mode)) {
			if (submitted || approved) {
				canModify = false
				canSubmit = false
			}
		} else {
			canSubmit = false
		}

		switch (activity.activity_type_id) {
		case 1:
			return (
				<FreeTextActivity
					activity={activity}
					canModify={canModify}
					canSubmit={canSubmit}
					saving={savingActivity}
					submitting={submittingActivity}
					onSave={handleSubmit(saveActivity)}
					onSubmit={handleSubmit(submitActivity)}
					activeField={activeField}
				/>
			)
		case 2:
			return (
				<MultipleTextActivity
					activity={activity}
					canModify={canModify}
					canSubmit={canSubmit}
					saving={savingActivity}
					submitting={submittingActivity}
					onSave={handleSubmit(saveActivity)}
					onSubmit={handleSubmit(submitActivity)}
					activeField={activeField}
				/>
			)
		case 3:
			return (
				<DragActivity
					activity={activity}
					canModify={canModify}
					canSubmit={canSubmit}
					saving={savingActivity}
					submitting={submittingActivity}
					order={(initialValues && initialValues.input0)}
					onChange={(name, value) => change(name, value)}
					onSave={handleSubmit(saveActivity)}
					onSubmit={handleSubmit(submitActivity)}
				/>
			)
		case 4:
			return (
				<AreaActivity
					activity={activity}
					canModify={canModify}
					canSubmit={canSubmit}
					saving={savingActivity}
					submitting={submittingActivity}
					selected={(initialValues && initialValues.input0)}
					onChange={(name, value) => change(name, value)}
					onSave={handleSubmit(saveActivity)}
					onSubmit={handleSubmit(submitActivity)}
				/>
			)
		case 5:
			return (
				<MultipleChoiceActivity
					activity={activity}
					canModify={canModify}
					canSubmit={canSubmit}
					saving={savingActivity}
					submitting={submittingActivity}
					onSave={handleSubmit(saveActivity)}
					onSubmit={handleSubmit(submitActivity)}
				/>
			)
		case 7:
			if (R.equals('preview', mode)) {
				canModify = false
			}

			return (
				<UploadActivity
					userId={userId}
					activity={activity}
					canModify={canModify}
					canSubmit={canSubmit}
					saving={savingActivity}
					submitting={submittingActivity}
					uploads={(initialValues && initialValues.input0)}
					onChange={(name, value) => change(name, value)}
					onSave={handleSubmit(saveActivity)}
					onSubmit={handleSubmit(submitActivity)}
				/>
			)
		default:
			return null
		}
	}

	render() {
		const { gettingActivity, activity } = this.props
		let rendered = null
		if (activity) {
			rendered = this.renderActivity(activity)
		} else if (gettingActivity) {
			rendered = <Loading message="Loading activity..." />
		} else {
			rendered = <NoResults message="Trying to load activity." />
		}

		return (
			<View style={styles.wrapper}>
				<NavBar
					title="Activity"
					navigationBarStyle={{ borderBottomWidth: 1 }}
					renderLeftButton={() => (
						<NavBarIconButton
							name="cancel"
							onPress={NavigationActions.pop}
						/>
					)}
				/>
				{rendered}
			</View>
		)
	}

}

ActivityScreen.propTypes = {
	mode: PropTypes.oneOf(['preview', 'learn']), // NOTE 'assess' for later
	memberId: PropTypes.number,
	unitId: PropTypes.number,
	workbookId: PropTypes.number,
	userId: PropTypes.number.isRequired,
	gettingActivity: PropTypes.bool.isRequired,
	savingActivity: PropTypes.bool.isRequired,
	submittingActivity: PropTypes.bool.isRequired,
	getWorkbookActivity: PropTypes.func.isRequired,
	unsetActivity: PropTypes.func.isRequired,
	saveActivity: PropTypes.func.isRequired,
	handleSubmit: PropTypes.func.isRequired,
	submitActivity: PropTypes.func.isRequired,
	activeField: PropTypes.string,
}

ActivityScreen.defaultProps = {
	mode: 'learn',
	memberId: 0,
	unitId: 0,
	workbookId: 0,
	activeField: null,
}

// StyleSheet
const {
	base: { wrapper },
} = ss

const styles = ss.create({
	wrapper: {
		...wrapper,
	},
})

// Redux mappings
const mapStateToProps = (state) => {
	const { activityForm } = state.form

	return {
		userId: state.user.data.member_id,
		gettingActivity: state.workbook.gettingActivity,
		savingActivity: state.workbook.savingActivity,
		submittingActivity: state.workbook.submittingActivity,
		activity: state.workbook.activity.data,
		submitted: state.workbook.activity.submitted,
		approved: state.workbook.activity.approved,
		initialValues: state.workbook.activity.evidence,
		activeField: activityForm && activityForm.active,
	}
}

function mergeProps(stateProps, dispatchProps, ownProps) {
	const { dispatch } = dispatchProps
	const {
		memberId,
		unitId,
		workbookId,
		activityId,
		activityCode,
	} = ownProps
	let mode = 'learn'

	if (unitId) mode = 'preview'

	return {
		...ownProps,
		...stateProps,
		getWorkbookActivity: () => {
			if (R.equals('learn', mode)) {
				dispatch(WorkbookActions.getWorkbookActivityAttempt(memberId, activityId))
			} else {
				dispatch(WorkbookActions.getIqaWorkbookActivityAttempt(unitId, workbookId, activityCode))
			}
		},
		saveActivity: (values) => {
			const evidence = Object.keys(values || {})

			// if (evidence.length && evidence.every(el => !R.isEmpty(values[el]))) {
			if (evidence.length) {
				if (R.equals('learn', mode)) {
					dispatch(WorkbookActions.saveWorkbookActivityAttempt(activityId, values))
				}
			} else {
				Alert.alert('Error!', 'Could not save activity. Nothing to save.')
				// TODO dispatch(WorkbookActions.saveWorkbookActivityFailure('Nothing to save.'))
			}
		},
		submitActivity: (values, func, form) => {
			const { activity } = form
			const evidence = Object.keys(values || {})
			let valid = false

			if (evidence && activity) {
				switch (activity.activity_type_id) {
				case 1:
					valid = evidence.length === activity.content.promptTitles.length
					break
				case 2:
					valid = evidence.length === activity.content.prompts.length
					break
				case 3:
					const order = values.input0
					valid = order && order.filter(el => el.selected).length === activity.content.items.length
					break
				case 4:
					const areas = values.input0
					valid = areas && Object.keys(areas).reduce((acc, cur) =>
						acc + areas[cur].length, 0) === activity.content.items.length
					break
				case 5:
					valid = evidence.length === activity.content.prompts.length
					break
				case 7:
					valid = values.input0 && values.input0.length > 0
					break
				default:
					valid = false
					break
				}
			}

			if (valid) {
				if (R.equals('learn', mode)) {
					dispatch(WorkbookActions.saveWorkbookActivityAttempt(activityId, values, 1))
				}
			} else {
				Alert.alert('Error!', 'Could not submit activity. Please complete the activity and try again.')
				// TODO dispatch(WorkbookActions.saveWorkbookActivityFailure('Please complete activity and try again.'))
			}
		},
		unsetActivity: () => dispatch(WorkbookActions.unsetActivity()),
	}
}

const ActivityScreenComponent = reduxForm({
	form: 'activityForm',
	destroyOnUnmount: true,
	shouldValidate: () => false,
})(ActivityScreen)

export default connect(mapStateToProps, null, mergeProps)(ActivityScreenComponent)
