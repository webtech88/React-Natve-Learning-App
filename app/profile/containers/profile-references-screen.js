import React, { Component } from 'react'
import {
	View,
} from 'react-native'

import R from 'ramda'
import { Actions as NavigationActions } from 'react-native-router-flux'
import { connect } from 'react-redux'

import ProfileActions from '../actions/creator'
import ss from '../../styles'
import common from '../../common'
import ProfileReferencesListView from '../components/profile-references-list-view'

const { Button, SegmentedControl, NoResults } = common.components.core
const { NavBar, NavBarIconButton } = common.components.navigation

const TABS = ['Received', 'Given']


class ProfileReferencesScreen extends Component {

	state = {
		activeTabIndex: 0,
	}

	onSegmentChange = (index) => {
		this.setState({ activeTabIndex: index })
	}

	render() {
		const {
			profileType,
			receivedReferences,
			givenReferences,
			navigateToProfileReferenceForm,
			updateProfileReference,
		} = this.props

		const { activeTabIndex } = this.state
		const activeTabReferences = (activeTabIndex === 0) ? receivedReferences : givenReferences
		let contents

		if (activeTabReferences) {
			// no references
			if (!activeTabReferences.length) {
				contents = (
					<View style={{ flex: 1 }}>
						<NoResults
							name="references"
							size={size(42)}
							message="No references yet"
						/>
					</View>
				)
			} else {
				let referencesProps

				if (R.equals('user', profileType) && activeTabIndex === 0) {
					referencesProps = {
						onUpdate: updateProfileReference,
					}
				}

				contents = (
					<View style={{ flex: 1 }}>
						{!R.equals('user', profileType) &&
							<View style={styles.add}>
								<Button
									label="Add"
									onPress={navigateToProfileReferenceForm}
								/>
							</View>
						}
						<ProfileReferencesListView
							key={`References_${activeTabIndex}`}
							references={activeTabReferences}
							{...referencesProps}
						/>
					</View>
				)
			}
		}

		return (
			<View style={styles.wrapper}>
				<NavBar
					title={this.props.title}
					renderLeftButton={() => (
						<NavBarIconButton name="cancel"
							onPress={() => NavigationActions.pop()}
						/>
					)}
				/>
				{R.equals('user', profileType) &&
					<SegmentedControl
						style={styles.segmentedControl}
						segments={TABS}
						selectedIndex={activeTabIndex}
						onPress={this.onSegmentChange}
					/>
				}
				{contents}
			</View>
		)
	}

}

// StyleSheet
const {
	size,
	base: { wrapper },
} = ss

const styles = ss.create({
	wrapper: {
		...wrapper,
		// backgroundColor: 'pink', // NOTE testing flexbox
	},
	add: {
		backgroundColor: '#F9F9F9',
		padding: size(20),
		borderTopWidth: 1,
		borderBottomWidth: 1,
		borderColor: 'rgba(0, 0, 0, .1)',
	},
	segmentedControl: {
		backgroundColor: 'white',
		borderBottomColor: 'rgba(0, 0, 0, 0.1)',
		borderBottomWidth: 1,
	},
})


// Redux mappings
const mapStateToProps = state => ({
	userId: state.user.data.member_id,
	receivedReferences: state.profile.receivedReferences,
	givenReferences: state.profile.givenReferences,
	connectionProfile: state.profile.connectionProfile.data,
	connectionReceivedReferences: state.profile.connectionProfile.receivedReferences,
	connectionGivenReferences: state.profile.connectionProfile.givenReferences,
})

function mergeProps(stateProps, dispatchProps, ownProps) {
	const { dispatch } = dispatchProps
	let userId
	let title = stateProps.connectionProfile && `${stateProps.connectionProfile.first_name}'s References`
	let receivedReferences = stateProps.connectionReceivedReferences
	let givenReferences = stateProps.connectionGivenReferences

	// NOTE is current user profile?
	if (R.equals('user', ownProps.profileType)) {
		userId = stateProps.userId
		title = 'My References'
		receivedReferences = stateProps.receivedReferences
		givenReferences = stateProps.givenReferences
	}

	return {
		...ownProps,
		title,
		receivedReferences,
		givenReferences,
		navigateToProfileReferenceForm: () => NavigationActions.ProfileReferenceForm(),
		updateProfileReference: (reference_id, status) => {
			if (userId) {
				dispatch(ProfileActions.updateProfileReferenceAttempt(userId, reference_id, status))
			}
		},
	}
}

export default connect(mapStateToProps, null, mergeProps)(ProfileReferencesScreen)
