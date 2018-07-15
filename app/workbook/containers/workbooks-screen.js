import React, { Component } from 'react'
import {
	View,
	Linking,
} from 'react-native'

import PropTypes from 'prop-types'

import R from 'ramda'
import { Actions as NavigationActions } from 'react-native-router-flux'

import { connect } from 'react-redux'

import ss from '../../styles'
import WorkbooksCardView from '../components/workbooks-card-view'
import WorkbookListView from '../components/workbook-list-view'
import { getActiveQualification } from '../util/selectors'

class WorkbooksScreen extends Component {

	constructor(props) {
		super(props)

		this.state = {
			visible: false,
			workbooks: this.props.workbooks,
		}
	}

	componentDidMount() {
		this.setState({ visible: true })
	}

	componentWillReceiveProps(nextProps) {
		if (!R.equals(this.props.workbooks, nextProps.workbooks) && nextProps.workbooks === null) {
			this.setState({ visible: false })
		}
	}

	sendEmail = () => {
		const { centreContactEmail } = this.props

		if (centreContactEmail) {
			const url = `mailto:${centreContactEmail}?subject=Workbooks`
			Linking.openURL(url).catch(err => console.error('An error occurred', err))
		}
	}

	render() {
		const {
			activeTabIndex,
			navigateToWorkbook,
			navigateToWorkbookInfo,
			centreContactEmail,
		} = this.props
		const { visible, workbooks } = this.state

		// render cover or list view
		if (activeTabIndex === 0) {
			return (
				<WorkbooksCardView
					visible={visible}
					workbooks={workbooks}
					onPress={navigateToWorkbook}
					onUnmount={() => NavigationActions.popTo('Qualifications')}
					contactCentre={centreContactEmail ? this.sendEmail : null}
				/>
			)
		}

		return (
			<View style={styles.wrapper}>
				<WorkbookListView
					visible={visible}
					workbooks={workbooks}
					onPress={navigateToWorkbookInfo}
					onUnmount={() => NavigationActions.popTo('Qualifications')}
					contactCentre={centreContactEmail ? this.sendEmail : null}
				/>
			</View>
		)
	}

}

WorkbooksScreen.propTypes = {
	activeTabIndex: PropTypes.number,
	centreContactEmail: PropTypes.string,
	workbooks: PropTypes.array,
	navigateToWorkbook: PropTypes.func.isRequired,
	navigateToWorkbookInfo: PropTypes.func.isRequired,
}

WorkbooksScreen.defaultProps = {
	activeTabIndex: 0,
	workbooks: null,
}


// StyleSheet
const {
	base: { wrapper },
} = ss

const styles = ss.create({
	wrapper: {
		...wrapper,
		backgroundColor: 'white',
		// backgroundColor: 'pink', // NOTE testing flexbox
	},
	loading: {
		marginTop: ss.constants.HEIGHT_NAV_BAR,
	},
})


// Redux mappings

const mapStateToProps = (state) => {
	const qualification = getActiveQualification(state.qualifications)

	return ({
		workbooks: (qualification && qualification.workbooks) || null,
		centreContactEmail: (qualification && qualification.centre_contact_email) || null,
		navigateToWorkbook: (workbookId) => {
			NavigationActions.Workbook({ memberId: state.user.data.member_id, workbookId })
		},
		navigateToWorkbookInfo: (workbook) => {
			NavigationActions.WorkbookInfo({ workbook })
		},
	})
}

export default connect(mapStateToProps)(WorkbooksScreen)
