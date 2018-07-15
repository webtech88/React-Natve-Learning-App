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

import Qualifications from '../components/qualifications'
import WorkbookActions from '../actions/creator'

const { Loading, NoResults } = common.components.core


class QualificationsScreen extends Component {

	constructor(props) {
		super(props)

		this.state = {
			visible: false,
		}
	}

	componentDidMount() {
		const { qualifications, activeQualificationId, sectorId } = this.props
		if (sectorId && (qualifications === null || !Object.keys(qualifications).length)) {
			this.props.getQualifications(sectorId)
		} else if (activeQualificationId) {
			NavigationActions.QualificationWorkbooks()
		} else {
			this.setState({ visible: true })
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.currentSceneName === 'Qualifications') {
			if (nextProps.activeQualificationId) {
				this.setState({ visible: false })
				// TODO better approach?
				if (this.props.currentSceneName !== nextProps.currentSceneName) {
					NavigationActions.QualificationWorkbooks()
				}
			} else {
				this.setState({ visible: true })
			}
		}
	}

	render() {
		const {
			currentSceneName,
			gettingQualifications,
			qualifications,
			currentQualificationId,
			// activeQualificationId,
			navigateToWorkbooks,
			setCurrentQualifiactionId,
		} = this.props
		let rendered = null

		if (qualifications && Object.keys(qualifications).length) {
			// play video in background?
			const playVideo = R.contains(
				currentSceneName,
				['Qualifications', 'QualificationWorkbooks', 'WorkbooksSwiper'],
			)

			rendered = (
				<View style={{ flex: 1 }}>
					<Qualifications
						visible={this.state.visible}
						playVideo={playVideo}
						qualifications={qualifications}
						currentQualificationId={currentQualificationId}
						setCurrentQualifiactionId={setCurrentQualifiactionId}
						// TODO for swiper
						// activeQualificationId={activeQualificationId}
						onPress={navigateToWorkbooks}
					/>
				</View>
			)
		} else if (gettingQualifications) {
			rendered = <Loading message="Loading qualifications..." />
		} else {
			rendered = (
				<View style={{ flex: 1 }}>
					<NoResults message="No qualifications yet" />
				</View>
			)
		}

		return (
			<View style={styles.wrapper}>
				{rendered}
			</View>
		)
	}

}

QualificationsScreen.propTypes = {
	currentSceneName: PropTypes.string,
	gettingQualifications: PropTypes.bool.isRequired,
	qualifications: PropTypes.object,
	currentQualificationId: PropTypes.number,
	activeQualificationId: PropTypes.number,
	getQualifications: PropTypes.func.isRequired,
	navigateToWorkbooks: PropTypes.func.isRequired,
	sectorId: PropTypes.number,
	setCurrentQualifiactionId: PropTypes.func.isRequired,
}

QualificationsScreen.defaultProps = {
	currentSceneName: null,
	qualifications: null,
	currentQualificationId: null,
	activeQualificationId: null,
	sectorId: 0,
}


// StyleSheet
const {
	base: { wrapper },
} = ss

const styles = ss.create({
	wrapper: {
		...wrapper,
		backgroundColor: '#F4F3F5',
		// backgroundColor: 'pink', // NOTE testing flexbox
		marginTop: ss.constants.HEIGHT_NAV_BAR,
		paddingTop: 0,
	},
})

// Redux mappings
const mapStateToProps = (state) => {
	const { qualifications } = state
	const { currentScene } = state.navigation
	const { currentQualification } = state.user

	return {
		currentSceneName: (currentScene && currentScene.name) || null,
		sectorId: currentQualification && currentQualification.sector_id,
		gettingQualifications: qualifications.gettingQualifications,
		currentQualificationId: qualifications.currentQualificationId,
		activeQualificationId: qualifications.activeQualificationId,
		qualifications: qualifications.data,
	}
}

const mapDispatchToProps = dispatch => ({
	getQualifications: sectorId => dispatch(WorkbookActions.getQualificationsAttempt(sectorId)),
	setCurrentQualifiactionId: qualificationId => dispatch(WorkbookActions.setCurrentQualifiactionId(qualificationId)),
	navigateToWorkbooks: (qualificationId) => {
		dispatch(WorkbookActions.setActiveQualificationId(qualificationId))
		NavigationActions.QualificationWorkbooks()
	},
})

export default connect(mapStateToProps, mapDispatchToProps)(QualificationsScreen)
