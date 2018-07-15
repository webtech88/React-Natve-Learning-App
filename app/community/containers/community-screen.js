import React, { Component } from 'react'
import {
	View,
	Animated,
	InteractionManager,
	Platform,
} from 'react-native'

import { Actions as NavigationActions } from 'react-native-router-flux'
import { connect } from 'react-redux'

import { getConnections, getConnectionsOnline } from '../util/selectors'
import CommunityActions from '../actions/creator'
import common from '../../common'
import CommunityCardView from '../components/community-card-view'

import ss from '../../styles'

const {
	CommunityListView,
	Loading,
	NoResults,
	SegmentedControl,
} = common.components.core

const TABS = ['All', 'Online']
const HEIGHT_SEGMENTED_CONTROL = ss.constants.HEIGHT_SEGMENTED_CONTROL


class CommunityScreen extends Component {
	state = {
		activeTabIndex: 0,
		scrollOffsetY: new Animated.Value(0),
		refreshing: false,
	}

	componentDidMount() {
		if (!this.props.contacts) {
			InteractionManager.runAfterInteractions(() => {
				this.props.getContacts()
			})
		}
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.contacts !== nextProps.contacts) {
			InteractionManager.runAfterInteractions(() => {
				this.setState({ refreshing: false })
			})
		}
	}

	onSegmentChange = (index) => {
		this.setState({ activeTabIndex: index, refreshing: false })
	}

	onRefresh = () => {
		this.setState({ refreshing: true })
		this.props.getContacts()
	}

	render() {
		const {
			gettingContacts,
			updatingSettings,
			settingsView,
			contacts,
			contactsOnline,
			navigateToConnectionProfile,
		} = this.props
		// show loading while updating settings
		if (updatingSettings) {
			return <View style={styles.empty}><Loading /></View>
		}

		// show loading while getting contacts
		if (contacts == null || (gettingContacts && !this.state.refreshing)) {
			return <View style={styles.empty}><Loading message="Loading..." /></View>
		}

		// no results for All
		if (!contacts.length) {
			return (
				<View style={styles.empty}>
					<NoResults
						name="community"
						size={ss.size(42)}
						message="No connections yet"
					/>
				</View>
			)
		}

		const { refreshing, activeTabIndex } = this.state
		const activeTabContacts = (activeTabIndex === 1) ? contactsOnline : contacts

		// show/hide segmented control
		const translateY = this.state.scrollOffsetY.interpolate({
			inputRange: [0, 20, HEIGHT_SEGMENTED_CONTROL],
			outputRange: [0, 0, -HEIGHT_SEGMENTED_CONTROL],
			extrapolate: 'clamp',
		})

		// show/hide segmented inset
		const segmentedHeight = this.state.scrollOffsetY.interpolate({
			inputRange: [0, 20, HEIGHT_SEGMENTED_CONTROL],
			outputRange: [HEIGHT_SEGMENTED_CONTROL, HEIGHT_SEGMENTED_CONTROL, 0],
			extrapolate: 'clamp',
		})

		// cards or list view or null
		let contents = null
		if (settingsView === 'cards') {
			contents = (
				<CommunityCardView
					animated={!refreshing}
					contacts={activeTabContacts}
					onPress={navigateToConnectionProfile}
					onScroll={Animated.event(
						[{ nativeEvent: { contentOffset: { y: this.state.scrollOffsetY } } }],
					)}
					onRefresh={this.onRefresh}
					refreshing={refreshing}
				/>
			)
		} else if (settingsView === 'list') {
			contents = (
				<CommunityListView
					style={{ backgroundColor: 'white' }}
					animated={!refreshing}
					contacts={activeTabContacts}
					onPress={navigateToConnectionProfile}
					onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: this.state.scrollOffsetY } } }])}
					onRefresh={this.onRefresh}
					refreshing={refreshing}
				/>
			)
		}

		return (
			<View style={styles.wrapper}>
				<Animated.View style={[
					styles.segmentedControl,
					{ transform: [{ translateY: Platform.OS === 'ios' ? translateY : 0 }] },
				]}
				>
					<SegmentedControl
						style={{ backgroundColor: 'white' }}
						segments={TABS}
						selectedIndex={activeTabIndex}
						onPress={this.onSegmentChange}
					/>
				</Animated.View>
				<Animated.View style={Platform.OS === 'ios' ? { height: segmentedHeight } : null} />
				{
					// no results for Online
					(activeTabIndex === 1) && !activeTabContacts.length
					?
						<View style={{ flex: 1, backgroundColor: 'white' }}>
							<NoResults
								name="community"
								size={ss.size(42)}
								message="0 contacts online"
							/>
						</View>
					:
					// return either cards or list or null
					contents
				}
			</View>
		)
	}
}

// StyleSheet
const {
	base: { wrapper },
} = ss

const styles = ss.create({
	wrapper: {
		...wrapper,
		backgroundColor: '#F9F9F9',
		// backgroundColor: 'pink', // NOTE testing flexbox
	},
	empty: {
		flex: 1,
		marginTop: ss.constants.HEIGHT_NAV_BAR,
		borderTopWidth: 1,
		borderTopColor: 'rgba(0, 0, 0, .1)',
	},
	segmentedControl: {
		ios: {
			marginBottom: -HEIGHT_SEGMENTED_CONTROL,
			zIndex: 1,
		},
		android: {
			// marginBottom: -5,
		},
		borderBottomWidth: 1,
		borderBottomColor: 'rgba(0, 0, 0, .1)',
	},
})

// Redux mappings


const mapStateToProps = (state) => {
	const community = state.community

	return {
		centreId: state.user.currentQualification && state.user.currentQualification.centre_id,
		gettingContacts: community.gettingContacts,
		updatingSettings: community.updatingSettings,
		settingsView: community.settingsView,
		contacts: getConnections(community),
		contactsOnline: getConnectionsOnline(community),
	}
}

function mergeProps(stateProps, dispatchProps, ownProps) {
	const { dispatch } = dispatchProps
	const { centreId } = stateProps

	return {
		...ownProps,
		...stateProps,
		getContacts: () => {
			dispatch(CommunityActions.getContactsAttempt(centreId))
		},
		navigateToConnectionProfile: (connection) => {
			if (connection.member_id && (connection.status || connection.centre_roles)) {
				if (connection.status === 'friend' || connection.centre_roles) {
					NavigationActions.ConnectionProfile({ memberId: connection.member_id })
				} else {
					dispatch(CommunityActions.setActiveConnectionId(connection.member_id))
				}
			}
		},
	}
}

export default connect(mapStateToProps, null, mergeProps)(CommunityScreen)
