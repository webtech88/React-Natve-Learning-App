import React, { Component } from 'react'
import {
	View,
	Platform,
} from 'react-native'

import R from 'ramda'
import { Actions as NavigationActions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import CommunityActions from '../actions/creator'

import ss from '../../styles'
import common from '../../common'
import showreel from '../../profile/components/showreel'

const { Button, Loading, TransText } = common.components.core
const { NavBar } = common.components.navigation
const { ShowreelBackground } = showreel

const extractFirstName = (screenName) => {
	const names = R.split(' ', screenName)
	return names[0] || screenName
}


class ConnectionInfoScreen extends Component {

	componentWillReceiveProps(nextProps) {
		if (this.props.connection.status !== nextProps.connection.status && nextProps.connection.status === 'friend') {
			NavigationActions.ConnectionProfile({
				type: 'replace',
				memberId: nextProps.connection.member_id,
			})
		}
	}

	componentWillUnmount() {
		this.props.unsetActiveConnectionId()
	}

	renderConnection() {
		const {
			connection: {
				member_id: memberId,
				screen_name: screenName,
				status,
			},
			action,
			attempting,
			success,
			error,
			manageConnection,
		} = this.props
		let renderedStatus = []
		let renderedTIndices = []
		let renderedButtons = null
		let renderedState = null

		switch (status) {
		case 'unrelated':
			renderedStatus = ['You are not connected with ', extractFirstName(screenName)]
			renderedTIndices = [0]
			renderedButtons = (
				<View style={styles.actionButtons}>
					<Button
						style={styles.actionButton}
						height={size(40)}
						type="outline"
						color="white"
						label="Connect"
						isLoading={(action === 'request' && attempting) || false}
						disabled={attempting}
						onPress={() => manageConnection(memberId, 'request')}
					/>
				</View>
				)
			break
		case 'pending':
			renderedStatus = ['Waiting for ', extractFirstName(screenName), ' to accept your invitation']
			renderedTIndices = [0, 2]
			renderedButtons = (
				<View style={styles.actionButtons}>
					<Button
						style={styles.actionButton}
						height={size(40)}
						type="outline"
						color="white"
						label="Cancel"
						isLoading={(action === 'cancel' && attempting) || false}
						disabled={attempting}
						onPress={() => manageConnection(memberId, 'cancel')}
					/>
				</View>
				)
			break
		case 'invite':
			renderedStatus = `${extractFirstName(screenName)}`
			renderedStatus = [extractFirstName(screenName), ' has sent you a connection invite']
			renderedTIndices = [1]
			renderedButtons = (
				<View style={styles.actionButtons}>
					<Button
						style={styles.actionButton}
						height={size(40)}
						type="outline"
						color="white"
						label="Accept"
						isLoading={(action === 'accept' && attempting) || false}
						disabled={attempting}
						onPress={() => manageConnection(memberId, 'accept')}
					/>
					<Button
						style={[styles.actionButton, { marginLeft: size(15) }]}
						height={size(40)}
						type="outline"
						color="white"
						label="Decline"
						isLoading={(action === 'decline' && attempting) || false}
						disabled={attempting}
						onPress={() => manageConnection(memberId, 'decline')}
					/>
				</View>
				)
			break
		default:
			renderedStatus = []
			renderedTIndices = []
		}

		if (attempting) {
			renderedState = <TransText style={styles.p} transkey="LOADING" />
		} else if (success || error) {
			renderedState = <TransText style={styles.p} transkey={success || error} />
		}

		return (
			<View style={styles.connection}>
				<View style={styles.header}>
					<TransText style={styles.title} transkey={screenName} />
					{/* TODO Alex <Text style={styles.subtitle}>Pearson College</Text> */}
				</View>
				<View style={styles.actions}>
					<View style={styles.actionStatus}>
						<TransText style={styles.p} transkeys={renderedStatus} tindices={renderedTIndices} />
					</View>
					{renderedButtons}
					<View style={styles.actionState}>
						{renderedState}
					</View>
				</View>
			</View>
		)
	}

	render() {
		const { connection } = this.props
		const {
			screen_name: screenName,
			cloudinary_file_id: cloudinaryPublicId,
		} = connection
		let rendered = null

		if (connection) {
			rendered = this.renderConnection()
		} else {
			rendered = <Loading color="white" message="Loading profile..." />
		}

		if (Platform.OS === 'ios') {
			return (
				<View style={styles.wrapper}>
					<NavBar
						title={connection && connection.screen_name ? `${extractFirstName(connection.screen_name)}'s Profile` : 'Profile'}
						titleStyle={{ color: 'white' }}
						leftButtonImage={ss.images.iconNavCloseWhite}
						onLeft={() => NavigationActions.pop()}
						navigationBarStyle={{ backgroundColor: 'transparent', zIndex: 1 }}
					/>
					<ShowreelBackground cloudinaryPublicId={cloudinaryPublicId || null} />
					{rendered}
				</View>
			)
		}
		return (
			<View style={styles.wrapper}>
				<ShowreelBackground cloudinaryPublicId={cloudinaryPublicId || null} />
				{rendered}
				<View style={styles.androidNavBar}>
					<NavBar
						title={connection && connection.screen_name ? `${extractFirstName(connection.screen_name)}'s Profile` : 'Profile'}
						titleStyle={{ color: 'white', marginBottom: 2 }}
						leftButtonImage={ss.images.iconNavCloseWhite}
						onLeft={() => NavigationActions.pop()}
						navigationBarStyle={{ backgroundColor: 'transparent', zIndex: 1 }}
					/>
				</View>
			</View>
		)
	}
}

// StyleSheet
const {
	size,
	base: { wrapper },
	typo: { h1, p, pLight },
} = ss

const styles = ss.create({
	wrapper: {
		...wrapper,
		backgroundColor: 'rgba(0, 0, 0, .8)',
		// backgroundColor: 'pink', // NOTE testing flexbox
	},
	connection: {
		zIndex: 1,
		flex: 1,
		paddingVertical: size(30),
		paddingHorizontal: size(20),
	},
	header: {
		// backgroundColor: 'rgba(255, 255, 255, 0.2)', // NOTE testing flexbox
		padding: size(20),
	},
	title: {
		...h1,
		fontSize: size(36),
		color: 'white',
		textAlign: 'center',
		marginBottom: size(20),
	},
	subtitle: {
		...pLight,
		fontSize: size(18),
		color: 'white',
		textAlign: 'center',
	},
	actions: {
		// backgroundColor: 'rgba(255, 255, 255, 0.2)', // NOTE testing flexbox
		flex: 1,
		justifyContent: 'flex-end',
	},
	actionStatus: {
		justifyContent: 'center',
		alignItems: 'center',
		height: size(50),
	},
	actionButtons: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginVertical: size(10),
	},
	actionButton: {
		width: size(120),
	},
	actionState: {
		justifyContent: 'center',
		alignItems: 'center',
		height: size(50),
	},
	p: {
		...p,
		color: 'white',
		textAlign: 'center',
	},
	androidNavBar: {
		position: 'absolute',
		top: 0,
		right: 0,
		left: 0,
		height: ss.constants.HEIGHT_NAV_BAR,
	},
})

// Redux mappings
const getConnection = createSelector(
	state => state.data,
	state => state.searchResults,
	state => state.activeConnectionId,
	(data, searchResults, activeConnectionId) =>
		R.find(R.propEq('member_id', activeConnectionId))(data)
		|| R.find(R.propEq('member_id', activeConnectionId))(searchResults),
)

const getManageConnection = createSelector(
	state => state.manageConnections,
	state => state.activeConnectionId,
	(manageConnections, activeConnectionId) => manageConnections[activeConnectionId],
)

const mapStateToProps = (state) => {
	const manageConnection = getManageConnection(state.community)

	return {
		connection: getConnection(state.community),
		action: (manageConnection && manageConnection.action) || null,
		attempting: (manageConnection && manageConnection.attempting) || false,
		success: (manageConnection && manageConnection.success) || null,
		error: (manageConnection && manageConnection.error) || null,
	}
}

const mapDispatchToProps = dispatch => ({
	manageConnection: (memberId, action) => dispatch(CommunityActions.manageConnectionAttempt(memberId, action)),
	unsetActiveConnectionId: () => dispatch(CommunityActions.unsetActiveConnectionId()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ConnectionInfoScreen)
